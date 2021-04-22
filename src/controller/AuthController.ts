import { compare } from 'bcryptjs';
import { Response } from 'express';
import { getRepository } from 'typeorm';
import { AuthUsuarioPayload } from '../@types/usuario';
import Usuario from '../entity/Usuario';
import { generateJwt } from '../helper/jwt';
import { CRequest } from '../util/HTTPUtils';
import { StatusCodes } from 'http-status-codes';

class AuthController {
  async autenticacao(req: CRequest<AuthUsuarioPayload>, res: Response) {
    const { email, senha } = req.body;

    const repoUsuario = getRepository(Usuario);

    const usuario = await repoUsuario.findOne({ where: { email } });

    if (!usuario) {
      return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    const senhaValida = await compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    const token = generateJwt({ id: usuario.id });

    delete usuario.senha;

    return res.json({ usuario, token });
  }
}

export default new AuthController();
