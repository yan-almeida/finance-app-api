import { NextFunction, Response } from 'express';
import { ValidationError } from 'yup';
import { CategoriaPayload } from '../@types/categoria';

import { salvarSchema } from '../schema/categoria/categoria.schema';
import { CRequest } from '../util/HTTPUtils';

export const salvarCategoriaValidator = async (
  req: CRequest<CategoriaPayload>,
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

export default salvarCategoriaValidator;
