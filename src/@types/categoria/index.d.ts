export type CategoriaPayload = {
  nome: string;
  cor: string;
  descricao: string;
  url: string;
  data: string;
};

export type EstatisticasCategoriaType = {
  id: number;
  nome: string;
  cor: string;
  corcategoria: string;
  corid: number;
  porcentagem: string;
};

export type CategoriaDetalhes = {
  id: number;
  nome: string;
  descricao: string;
  blob: string;
  cor: string;
  corCategoria?: string;
  corid?: string;
};
