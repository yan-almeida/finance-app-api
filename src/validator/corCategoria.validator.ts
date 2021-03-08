import { NextFunction, Response } from 'express';
import { ValidationError } from 'yup';
import { CorCategoriaType } from '../@types/corCategoria';

import { salvarSchema } from '../schema/corCategoria/corCategoria.schema';
import { CRequest } from '../util/HTTPUtils';

export const salvarCorCategoriaValidator = async (
  req: CRequest<CorCategoriaType>,
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
