import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getRepository } from 'typeorm';
import { SalvarUsuarioPayload } from '../@types/usuario';
import Usuario from '../entity/Usuario';
import { CRequest } from '../util/HTTPUtils';

class UsuarioController {
  async salvar(req: CRequest<SalvarUsuarioPayload>, res: Response) {
    const { nome, email, senha } = req.body;

    const repoUsuario = getRepository(Usuario);

    const usuarioExiste = await repoUsuario.findOne({ where: { email } });

    if (usuarioExiste) {
      return res.sendStatus(StatusCodes.CONFLICT);
    }

    const usuario = repoUsuario.create({ nome, email, senha });
    await repoUsuario.save(usuario);

    delete usuario.senha;

    return res.json(usuario);
  }

  async deletar(req: Request, res: Response) {
    const { id } = req.params;

    const repoUsuario = getRepository(Usuario);

    const usuarioExiste = await repoUsuario.findOne({ where: { id } });

    if (!usuarioExiste) {
      return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    await repoUsuario.delete(id);

    return res.json({ message: 'Conta deletada com sucesso.' });
  }
}

export default new UsuarioController();
