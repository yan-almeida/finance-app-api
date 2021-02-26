import Categoria from '../../entity/Categoria';

export type LancamentoPayload = {
  nome: string;
  descricao: string;
  valor: number;
  categoria: Categoria;
  data: string;
  entrada: boolean;
};
