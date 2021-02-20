import * as Yup from 'yup';
import { pt } from 'yup-locale-pt';

Yup.setLocale(pt);

export const salvarSchema = Yup.object({
  nome: Yup.string().min(3).max(300),
  email: Yup.string().email(),
  senha: Yup.string(),
});
