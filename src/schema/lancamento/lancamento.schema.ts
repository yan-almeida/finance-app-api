import * as Yup from 'yup';
import { pt } from 'yup-locale-pt';

Yup.setLocale(pt);

export const salvarSchema = Yup.object({
  categoria: Yup.number(),
  descricao: Yup.string().min(3).max(500),
  valor: Yup.number(),
  nome: Yup.string().min(3).max(300),
});
