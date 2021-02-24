import * as Yup from 'yup';
import { pt } from 'yup-locale-pt';

Yup.setLocale(pt);

export const salvarSchema = Yup.object({
  descricao: Yup.string().min(3).max(300),
  nome: Yup.string().min(3).max(300),
});
