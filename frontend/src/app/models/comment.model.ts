export interface Comment {
  id: string;
  incidentId: string;
  autor: string;
  mensagem: string;
  dataCriacao: string;
}

export interface CommentRequest {
  incidentId: string;
  autor: string;
  mensagem: string;
}
