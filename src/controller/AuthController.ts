import { compare, hashSync } from 'bcryptjs';
import { Response } from 'express';
import { getRepository } from 'typeorm';
import { AuthUsuarioPayload } from '../@types/usuario';
import Usuario from '../entity/Usuario';
import { generateJwt } from '../helper/jwt';
import { CRequest } from '../util/HTTPUtils';
import { StatusCodes } from 'http-status-codes';

import * as mailer from 'nodemailer';
import * as crypto from 'crypto';
import SendmailTransport = require('nodemailer/lib/sendmail-transport');

const SALTS = 10;

type ResetSenha = {
  email: string;
  senha: string;
};

class AuthController {
  async autenticacao(req: CRequest<AuthUsuarioPayload>, res: Response) {
    const { email, senha } = req.body;

    const repoUsuario = getRepository(Usuario);

    const usuario = await repoUsuario.findOne({
      where: {
        email,
      },
    });

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

  async perfil(req: CRequest, res: Response) {
    const repoUsuario = getRepository(Usuario);

    const usuarioExiste = await repoUsuario.findOne({
      where: { id: req.userId },
      relations: ['genero', 'orientacaoSexual'],
    });

    if (!usuarioExiste) {
      return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    const { senha, ativo, genero, orientacaoSexual, ...usuario } =
      usuarioExiste;

    return res.json({
      ...usuario,
      genero: genero.id,
      orientacaoSexual: orientacaoSexual.id,
    });
  }

  async resetarSenha(req: CRequest<ResetSenha>, res: Response) {
    const { email } = req.body;

    const repoUsuario = getRepository(Usuario);

    const usuario = await repoUsuario.findOne({ where: { email } });

    if (!usuario) {
      return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    const transporter = mailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: 'cd40fbda18aa7b',
        pass: 'd66a79bcfecf08',
      },
    });

    const newPass = crypto.randomBytes(4).toString('HEX');

    await transporter.sendMail({
      from: 'FinanceApp <af586a81b5-78d2ec@inbox.mailtrap.io>',
      to: usuario.email,
      subject: 'Recuperação de Senha!',
      text: `A sua nova senha é: ${newPass}`,
    });

    const usuarioNovaSenha = await repoUsuario.preload({
      id: usuario.id,
      ...{
        senha: hashSync(newPass, SALTS),
      },
    });

    await repoUsuario.save(usuarioNovaSenha);

    return res.sendStatus(StatusCodes.OK);
  }
}

export default new AuthController();
