export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
  fill?: string;
  codigo?: string;
}

export interface Professor {
  nome: string;
  departamento?: string;
  sigaa?: string;
  sala?: string;
}

export interface Disciplina {
  id: string;
  codigo: string;
  nome: string;
  turma: string;
  docente?: string;
  departamento?: string;
  horario?: string;
  alunos?: string | number;
  preferencias?: Array<{name: string; value: string | number}>;
  pcd?: boolean;
  pre_alocacao?: string;
  professor?: string;
  sala?: string;
  professorInfo?: Professor;
}

export type OcorrenciaTipo = 'manutencao' | 'limpeza' | 'equipamento' | 'outro';
export type OcorrenciaStatus = 'pendente' | 'em-analise' | 'resolvido';

export interface Ocorrencia {
  id: string;
  tipo: OcorrenciaTipo;
  descricao: string;
  sala: string;
  dataRegistro: string;
  status: OcorrenciaStatus;
}

export type SalaTipo =
  | 'sala-aula'
  | 'laboratorio'
  | 'auditorio'
  | 'professor'
  | 'administrativo'
  | 'outro';

export interface Sala {
  id: number | string;
  codigo: string;
  nome: string;
  bloco: string;
  capacidade?: number;
  tipo: SalaTipo;
  acessivel?: boolean;
  preferencias?: Array<{name: string; value: string | number}>;
  excecao?: string;
  classes?: Disciplina[];
  equipamentos?: string[];
  responsavel?: string;
  localizacaoMapa?: {x: number; y: number};
  professores?: Professor[];
}

export interface HorarioAula {
  disciplina: Disciplina;
  diaSemana: DiaSemana;
  horarioInicio: string;
  horarioFim: string;
}

export type DiaSemana = 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta';
