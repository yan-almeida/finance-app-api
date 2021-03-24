import * as Yup from 'yup';
import { pt } from 'yup-locale-pt';

Yup.setLocale(pt);

export const salvarSchema = Yup.object({
  categoria: Yup.number(),
  descricao: Yup.string().min(3).max(500),
  valor: Yup.string()
    .required('O valor é obrigatório.')
    .test(
      'is-number',
      'O valor deve ser maior que zero.',
      (number: any) =>
        parseFloat(number.replace(/[.]/g, '').replace(/[,]/g, '.')) > 0
    ),
  nome: Yup.string().min(3).max(300),
});
