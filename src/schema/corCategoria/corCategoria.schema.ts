import * as Yup from 'yup';
import { pt } from 'yup-locale-pt';

Yup.setLocale(pt);

export const salvarSchema = Yup.object({
  cor: Yup.string().min(3).max(300),
  corId: Yup.number().nullable(),
});
