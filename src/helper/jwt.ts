import { IncomingHttpHeaders } from 'http';
import { sign, verify } from 'jsonwebtoken';
import { Payload, VerifyJwtPayload } from '../@types/jwt';
require('dotenv').config();

const TOKEN_PRIVATE_KEY = process.env.JWT_TOKEN_PRIVATE_KEY; // secret key - .env
const REFRESH_TOKEN_PRIVATE_KEY = process.env.JWT_REFRESH_TOKEN_PRIVATE_KEY; // secret key - .env

const options = { expiresIn: '1 day' };
const refreshOptions = { expiresIn: '30 days' };

export const generateJwt = (payload: Payload) => {
  return sign(payload, TOKEN_PRIVATE_KEY, options);
};

export const verifyJwt = (token: string) => {
  return verify(token, TOKEN_PRIVATE_KEY) as VerifyJwtPayload;
};

export const generateRefreshJwt = (payload: Payload) => {
  return sign(payload, REFRESH_TOKEN_PRIVATE_KEY, refreshOptions);
};

export const verifyRefreshJwt = (token: string) => {
  return verify(token, REFRESH_TOKEN_PRIVATE_KEY) as VerifyJwtPayload;
};

export const getTokenFromHeaders = (
  headers: IncomingHttpHeaders
): string | null => {
  const token = headers['authorization'].replace(/[\\"]/g, '');

  return token ? token.slice(7, token.length) : null;
};
