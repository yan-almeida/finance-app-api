export type Payload = string | object | Buffer;

export type VerifyJwtPayload = {
  id: string;
  iat: number;
  exp: number;
};
