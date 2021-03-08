export type CategoriaPayload = {
  nome: string;
  cor: string;
  descricao: string;
  url: string;
  data: string;
};

export type EstatisticasCategoriaType = {
  categoria_nome: string;
  porcentagem: string;
  categoria_cor: string;
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
