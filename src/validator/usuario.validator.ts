import { NextFunction, Response } from 'express';
import { ValidationError } from 'yup';
import { SalvarUsuarioPayload } from '../@types/usuario';

import { salvarSchema } from '../schema/usuarios/usuario.schema';
import { CRequest } from '../util/HTTPUtils';

export const salvarUsuarioValidator = async (
  req: CRequest<SalvarUsuarioPayload>,
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

export default salvarUsuarioValidator;
