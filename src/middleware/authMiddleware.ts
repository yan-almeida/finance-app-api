import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getTokenFromHeaders, verifyJwt } from '../helper/jwt';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { url } = req;
  const rota = url.replace('/api/v1', '');

  const rotasExcluidas = ['/auth/sign-in', '/auth/sign-up', '/auth/refresh'];

  if (rota.includes('uploads')) {
    return next();
  }

  const rotaExcluida = !!rotasExcluidas.find((p) => p.startsWith(rota));
  if (rotaExcluida) return next();

  const token = getTokenFromHeaders(req.headers);

  if (!token) {
    return res.sendStatus(StatusCodes.UNAUTHORIZED);
  }

  try {
    const { id } = verifyJwt(token);

    req.userId = id;
    return next();
  } catch {
    return res.sendStatus(StatusCodes.UNAUTHORIZED);
  }
};

export default authMiddleware;
