import { NextFunction, Response } from 'express';
import { ValidationError } from 'yup';
import { LancamentoPayload } from '../@types/lancamento';

import { salvarSchema } from '../schema/lancamento/lancamento.schema';
import { CRequest } from '../util/HTTPUtils';

export const salvarLancamentoValidator = async (
  req: CRequest<LancamentoPayload>,
  res: Response,
  next: NextFunction
) => {
  try {
    await salvarSchema.validate(req.body, {
      abortEarly: false,
    });

    next();
  } catch (error) {
    const validationErrors: any = {};

    if (error instanceof ValidationError) {
      error.inner.forEach((e) => {
        validationErrors[e.path as any] = e.message;
      });

      return res.json(validationErrors);
    }
  }
};

export default salvarLancamentoValidator;
