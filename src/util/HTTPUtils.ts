import { Request } from 'express';

export interface CRequest<T = any> extends Request {
  body: T;
}
