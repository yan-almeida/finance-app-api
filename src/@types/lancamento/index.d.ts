import Categoria from '../../entity/Categoria';

export type LancamentoPayload = {
  nome: string;
  descricao: string;
  valor: string;
  categoria: Categoria;
  data: string;
  gastou: boolean;
};
