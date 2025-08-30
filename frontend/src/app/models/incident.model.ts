export interface Incident {
  id: string;
  titulo: string;
  descricao?: string;
  prioridade: Prioridade;
  status: Status;
  responsavelEmail: string;
  tags: string[];
  dataAbertura: string;
  dataAtualizacao: string;
}

export enum Prioridade {
  BAIXA = 'BAIXA',
  MEDIA = 'MEDIA',
  ALTA = 'ALTA'
}

export enum Status {
  ABERTA = 'ABERTA',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  RESOLVIDA = 'RESOLVIDA',
  CANCELADA = 'CANCELADA'
}

export interface IncidentRequest {
  titulo: string;
  descricao?: string;
  prioridade: Prioridade;
  status: Status;
  responsavelEmail: string;
  tags: string[];
}
