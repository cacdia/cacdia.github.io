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
}

type DiaSemana = 'Segunda' | 'Terça' | 'Quarta' | 'Quinta' | 'Sexta' | 'Sábado';
type Turno = 'Manhã' | 'Tarde' | 'Noite';

/**
 * Extrai horários de aulas a partir das informações da sala
 * @param codigoSala código da sala para obter os horários
 * @returns Array de horários de aula
 */
export function getHorariosSala(codigoSala: string): HorarioAula[] {
  const sala = getDetalhesSala(codigoSala);
  if (!sala || !sala.classes) return [];

  const horarios: HorarioAula[] = [];

  sala.classes.forEach(disciplina => {
    if (!disciplina.horario) return;

    // Exemplo de formato de horário: "3T34 5T34"
    // Significa: Quarta (3) Tarde (T) slots 3 e 4, Sexta (5) Tarde (T) slots 3 e 4
    const horariosStr = disciplina.horario.split(' ');

    horariosStr.forEach(horarioStr => {
      if (horarioStr.length < 3) return;

      // Extrai dia da semana (1=Segunda, 2=Terça, etc)
      const diaNum = parseInt(horarioStr.charAt(0), 10);
      if (isNaN(diaNum) || diaNum < 1 || diaNum > 6) return;

      // Mapeia número para nome do dia
      const diasMap: Record<number, DiaSemana> = {
        1: 'Segunda', 2: 'Terça', 3: 'Quarta',
        4: 'Quinta', 5: 'Sexta', 6: 'Sábado'
      };

      // Extrai o turno (M=Manhã, T=Tarde, N=Noite)
      const turnoChar = horarioStr.charAt(1);
      const turnosMap: Record<string, Turno> = {
        'M': 'Manhã', 'T': 'Tarde', 'N': 'Noite'
      };

      // Converte slots de horário para formato legível
      const slots = horarioStr.substring(2);
      let horarioFormatado = '';

      switch(turnoChar) {
        case 'M':
          horarioFormatado = slots.includes('1') || slots.includes('2') ? '08:00-10:00' : '10:00-12:00';
          break;
        case 'T':
          horarioFormatado = slots.includes('1') || slots.includes('2') ? '14:00-16:00' : '16:00-18:00';
          break;
        case 'N':
          horarioFormatado = slots.includes('1') || slots.includes('2') ? '18:30-20:30' : '20:30-22:00';
          break;
        default:
          horarioFormatado = 'Horário não especificado';
      }

      horarios.push({
        dia: diasMap[diaNum],
        horario: horarioFormatado,
        turno: turnosMap[turnoChar] || 'Tarde',
        disciplina: disciplina.nome,
        professor: disciplina.docente || disciplina.professor || 'Não informado',
        turma: disciplina.turma || 'N/A'
      });
    });
  });

  return horarios;
}
