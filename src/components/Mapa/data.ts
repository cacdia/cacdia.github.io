/**
 * Data functions for room details, occurrences and schedule data
 * Consolidated data layer for map functionality
 */

import { Sala, Ocorrencia, Disciplina, Professor } from './types';
import saci from '@site/static/data/saci/saci.json';
import docentes from '@site/static/data/docentes.json';

// Interfaces for SACI data
interface SaciClass {
  id: number;
  codigo: string;
  nome: string;
  turma: string;
  docente: string;
  departamento: string;
  horario: string;
  alunos: string | number;
  preferencias: Array<{ name: string; value: string | number }>;
  pcd: boolean;
  pre_alocacao: string;
}

interface SaciRoom {
  id: number;
  bloco: string;
  nome: string;
  capacidade: number;
  tipo: string;
  acessivel: boolean;
  preferencias: Array<{ name: string; value: string | number }>;
  execao: string;
  excecao: string;
  classes: SaciClass[];
}

interface SaciData {
  id: string;
  centro: string;
  date: string;
  description: string;
  solution_hash: string;
  status: string;
  userId: string | null;
  solution: {
    hash: string;
    status: string;
    error: string;
    solution: SaciRoom[];
  };
}

/**
 * Verifica se uma sala é uma sala de professor (CI 2XX)
 */
function isSalaProfessor(codigo: string): boolean {
  return /^CI\s*2[0-9]{2}$/i.test(codigo.trim());
}

/**
 * Carrega os dados de professores do arquivo JSON
 * e retorna um mapeamento de sala para professores
 */
function loadProfessoresData(): Record<string, Professor[]> {
  const professoresPorSala: Record<string, Professor[]> = {};

  docentes.forEach((docente) => {
    if (!docente.sala) return;

    // Normaliza o código da sala para ter um formato consistente
    // Se não começar com "CI ", adicione-o
    const sala = docente.sala.trim().toUpperCase();
    const normalizedSala = sala.startsWith('CI ') ? sala : `CI ${sala}`;

    if (!professoresPorSala[normalizedSala]) {
      professoresPorSala[normalizedSala] = [];
    }

    professoresPorSala[normalizedSala].push(docente);
  });

  return professoresPorSala;
}

// Cache dos dados dos professores
let cachedProfessores: Record<string, Professor[]> | null = null;

/**
 * Obtém a lista de professores de uma sala
 */
function getProfessoresBySala(codigoSala: string): Professor[] {
  if (cachedProfessores === null) {
    cachedProfessores = loadProfessoresData();
  }

  // Normaliza o código da sala para busca
  const salaCode = codigoSala.trim().toUpperCase();
  // Tenta encontrar com o código exato ou adicionando o prefixo "CI " se necessário
  return cachedProfessores[salaCode] ||
         cachedProfessores[salaCode.startsWith('CI ') ? salaCode : `CI ${salaCode}`] ||
         [];
}

/**
 * Transforma dados do SACI para o formato usado no mapa
 */
function transformSaciToSala(saciRoom: SaciRoom): Sala {
  // Mapear tipos do SACI para tipos do sistema
  const tipoMap: Record<string, Sala['tipo']> = {
    'Sala': 'sala-aula',
    'Laboratório': 'laboratorio',
    'Lab Hardware': 'laboratorio',
    'laboratorio': 'laboratorio',
    'auditorio': 'auditorio',
    'sala-aula': 'sala-aula',
    'professor': 'professor'
  };

  // Constrói o código da sala completo
  const codigoSala = `${saciRoom.bloco} ${saciRoom.nome}`;

  // Determinar bloco baseado no nome da sala
  function getBlocoFromName(nome: string): string {
    if (nome.startsWith('T') || nome.includes('(Auditório)')) {
      return 'Térreo';
    } else if (nome.startsWith('SB')) {
      return 'Subsolo';
    } else if (nome.startsWith('1') || nome.startsWith('2') || nome.startsWith('3')) {
      const firstDigit = nome.charAt(0);
      if (firstDigit === '1') return 'Primeiro Andar';
      if (firstDigit === '2') return 'Segundo Andar';
      if (firstDigit === '3') return 'Terceiro Andar';
    } else if (nome.startsWith('30') || nome.startsWith('31')) {
      return 'Terceiro Andar';
    }
    return saciRoom.bloco || 'Térreo';
  }

  // Transformar classes do SACI para disciplinas
  const classes: Disciplina[] = saciRoom.classes.map(saciClass => ({
    id: String(saciClass.id), // Converte número para string
    codigo: saciClass.codigo,
    nome: saciClass.nome,
    turma: saciClass.turma,
    docente: saciClass.docente,
    departamento: saciClass.departamento,
    horario: saciClass.horario,
    alunos: saciClass.alunos,
    preferencias: saciClass.preferencias,
    pcd: saciClass.pcd,
    pre_alocacao: saciClass.pre_alocacao,
    professor: saciClass.docente,
    sala: codigoSala
  }));

  // Verifica se é sala de professor
  const isProfessorRoom = isSalaProfessor(codigoSala);

  // Se for sala de professor, busca informações dos professores
  const professores = isProfessorRoom ? getProfessoresBySala(codigoSala) : undefined;

  return {
    id: saciRoom.id,
    codigo: codigoSala,
    nome: saciRoom.nome,
    bloco: getBlocoFromName(saciRoom.nome),
    capacidade: saciRoom.capacidade,
    tipo: isProfessorRoom ? 'professor' : (tipoMap[saciRoom.tipo] || 'sala-aula'),
    acessivel: saciRoom.acessivel,
    preferencias: saciRoom.preferencias,
    excecao: saciRoom.excecao || saciRoom.execao,
    classes: classes,
    professores: professores
  };
}

/**
 * Carrega dados do SACI do arquivo JSON
 */
function loadSaciData() {
  const saciData: SaciData = saci;
  const salas = saciData.solution.solution.map(transformSaciToSala);

  // Adiciona salas de professores que possivelmente não estão no SACI
  const professoresPorSala = loadProfessoresData();

  Object.entries(professoresPorSala).forEach(([codigoSala, professores]) => {
    // Verifica se a sala já existe nos dados do SACI
    if (!salas.some(sala => sala.codigo === codigoSala) && isSalaProfessor(codigoSala)) {
      const numeroSala = codigoSala.match(/\d+/)?.[0] || '';

      salas.push({
        id: String(Date.now() + Math.floor(Math.random() * 1000)), // Converter para string
        codigo: codigoSala,
        nome: numeroSala,
        bloco: 'CI',
        tipo: 'professor',
        professores: professores
      });
    }
  });

  return salas;
}

// Cache dos dados carregados
let cachedSalas: Sala[] | null = null;

// Mock occurrences data
const mockOcorrencias: Ocorrencia[] = [
  {
    id: 'oc-1',
    tipo: 'equipamento',
    descricao: 'Projetor não funciona',
    sala: 'CI T01',
    dataRegistro: new Date().toISOString(),
    status: 'pendente'
  },
  {
    id: 'oc-2',
    tipo: 'limpeza',
    descricao: 'Sala precisa de limpeza',
    sala: 'CI 103',
    dataRegistro: new Date().toISOString(),
    status: 'em-analise'
  },
  {
    id: 'oc-3',
    tipo: 'manutencao',
    descricao: 'Ar condicionado com problema',
    sala: 'CI T07',
    dataRegistro: new Date().toISOString(),
    status: 'pendente'
  }
];

/**
 * Carrega as salas (usando cache se disponível)
 */
function getSalas() {
  if (cachedSalas === null) {
    cachedSalas = loadSaciData();
  }
  return cachedSalas;
}

/**
 * Get room details by code
 */
export function getDetalhesSala(codigoSala: string): Sala | null {
  // Esta função agora é síncrona mas pode não ter dados na primeira chamada
  // Use getDetalhesSalaApi para garantir que os dados sejam carregados
  if (cachedSalas) {
    return cachedSalas.find((sala: Sala) => sala.codigo === codigoSala) || null;
  }
  return null;
}

/**
 * Get room details from API (main function)
 */
export async function getDetalhesSalaApi(codigoSala: string): Promise<Sala | null> {
  const salas = await getSalas();
  return salas.find((sala: Sala) => sala.codigo === codigoSala) || null;
}

/**
 * Register a new occurrence
 */
export function registrarOcorrencia(ocorrencia: Omit<Ocorrencia, 'id' | 'dataRegistro' | 'status'>): void {
  const novaOcorrencia: Ocorrencia = {
    ...ocorrencia,
    id: `oc-${Date.now()}`,
    dataRegistro: new Date().toISOString(),
    status: 'pendente'
  };

  // In a real app, this would persist to a database
  // For now, we just simulate the registration
  console.log('Nova ocorrência registrada:', novaOcorrencia);
}

/**
 * Get occurrences for a specific room
 */
export function getOcorrencias(codigoSala: string): Ocorrencia[] {
  // Adaptar para buscar ocorrências com o formato correto (com ou sem prefixo CI)
  const salaCode = codigoSala.replace('CI ', '');
  const fullSalaCode = codigoSala.startsWith('CI ') ? codigoSala : `CI ${codigoSala}`;

  return mockOcorrencias.filter((oc: Ocorrencia) =>
    oc.sala === codigoSala ||
    oc.sala === salaCode ||
    oc.sala === fullSalaCode
  );
}

/**
 * Get schedule data including all rooms
 * Main function to fetch room data for the map
 */
export function DadosCronograma(): {
  salas: Sala[];
} {
  const salas = getSalas();
  return {
    salas: salas
  };
}

export interface HorarioAula {
  dia: DiaSemana;
  horario: string;
  turno: Turno;
  disciplina: string;
  professor: string;
  turma: string;
  periodo: number; // Adicionar período específico
}

type DiaSemana = 'Segunda' | 'Terça' | 'Quarta' | 'Quinta' | 'Sexta' | 'Sábado';
type Turno = 'Manhã' | 'Tarde' | 'Noite';

// Mapeamento dos períodos por turno conforme SIGAA UFPB
export const PERIODOS_POR_TURNO: Record<Turno, Array<{ periodo: number; horario: string }>> = {
  'Manhã': [
    { periodo: 1, horario: '07:00-08:00' },
    { periodo: 2, horario: '08:00-09:00' },
    { periodo: 3, horario: '09:00-10:00' },
    { periodo: 4, horario: '10:00-11:00' },
    { periodo: 5, horario: '11:00-12:00' },
    { periodo: 6, horario: '12:00-13:00' }
  ],
  'Tarde': [
    { periodo: 1, horario: '13:00-14:00' },
    { periodo: 2, horario: '14:00-15:00' },
    { periodo: 3, horario: '15:00-16:00' },
    { periodo: 4, horario: '16:00-17:00' },
    { periodo: 5, horario: '17:00-18:00' },
    { periodo: 6, horario: '18:00-19:00' }
  ],
  'Noite': [
    { periodo: 1, horario: '19:00-20:00' },
    { periodo: 2, horario: '20:00-21:00' },
    { periodo: 3, horario: '21:00-22:00' },
    { periodo: 4, horario: '22:00-23:00' }
  ]
};

/**
 * Extrai horários de aulas a partir das informações da sala seguindo formato SIGAA UFPB
 * @param codigoSala código da sala para obter os horários
 * @returns Array de horários de aula
 */
export function getHorariosSala(codigoSala: string): HorarioAula[] {
  const sala = getDetalhesSala(codigoSala);
  if (!sala || !sala.classes) return [];

  const horarios: HorarioAula[] = [];

  sala.classes.forEach(disciplina => {
    if (!disciplina.horario) return;

    // Parse do formato SIGAA: "3T34 5T34" ou "24M12"
    const horariosStr = disciplina.horario.trim().split(/\s+/);

    horariosStr.forEach(horarioStr => {
      if (horarioStr.length < 3) return;

      // Extrai dias da semana - podem ser múltiplos dígitos consecutivos
      const diasMatch = horarioStr.match(/^([2-7]+)/);
      if (!diasMatch) return;

      const diasNums = diasMatch[1].split('').map(d => parseInt(d, 10));

      // Extrai turno
      const turnoMatch = horarioStr.match(/[MTN]/);
      if (!turnoMatch) return;

      const turnoChar = turnoMatch[0];
      const turnosMap: Record<string, Turno> = {
        'M': 'Manhã',
        'T': 'Tarde',
        'N': 'Noite'
      };

      const turno = turnosMap[turnoChar];
      if (!turno) return;

      // Extrai períodos - números após o turno
      const periodosMatch = horarioStr.match(/[MTN]([1-6]+)/);
      if (!periodosMatch) return;

      const periodosStr = periodosMatch[1];
      const periodos = periodosStr.split('').map(p => parseInt(p, 10));

      // Mapeia número para nome do dia
      const diasMap: Record<number, DiaSemana> = {
        2: 'Segunda',
        3: 'Terça',
        4: 'Quarta',
        5: 'Quinta',
        6: 'Sexta',
        7: 'Sábado'
      };

      // Cria entrada para cada combinação dia/período
      diasNums.forEach(diaNum => {
        if (diaNum < 2 || diaNum > 7) return;

        const dia = diasMap[diaNum];

        periodos.forEach(periodoNum => {
          const periodoInfo = PERIODOS_POR_TURNO[turno]?.find(p => p.periodo === periodoNum);
          if (!periodoInfo) return;

          horarios.push({
            dia,
            horario: periodoInfo.horario,
            turno,
            disciplina: disciplina.nome,
            professor: disciplina.docente || disciplina.professor || 'Não informado',
            turma: disciplina.turma || 'N/A',
            periodo: periodoNum
          });
        });
      });
    });
  });

  return horarios;
}

/**
 * Obtém a grade completa de horários com todas as células (ocupadas e vazias)
 * @param codigoSala código da sala
 * @returns Matriz estruturada de horários
 */
export function getGradeCompleta(codigoSala: string): Record<DiaSemana, Record<Turno, Array<{ periodo: number; horario: string; aula?: HorarioAula }>>> {
  const horariosOcupados = getHorariosSala(codigoSala);
  const grade: Record<DiaSemana, Record<Turno, Array<{ periodo: number; horario: string; aula?: HorarioAula }>>> = {} as any;

  const diasSemana: DiaSemana[] = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const turnos: Turno[] = ['Manhã', 'Tarde', 'Noite'];

  // Inicializa grade vazia
  diasSemana.forEach(dia => {
    grade[dia] = {} as any;
    turnos.forEach(turno => {
      grade[dia][turno] = PERIODOS_POR_TURNO[turno].map(p => ({
        periodo: p.periodo,
        horario: p.horario
      }));
    });
  });

  // Preenche com aulas ocupadas
  horariosOcupados.forEach(aula => {
    const slot = grade[aula.dia][aula.turno].find(s => s.periodo === aula.periodo);
    if (slot) {
      slot.aula = aula;
    }
  });

  return grade;
}
