import { Request, Response } from 'express';
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
      return res.sendStatus(409);
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
      return res.sendStatus(404);
    }

    await repoUsuario.delete(id);

    return res.json({ message: 'Conta deletada com sucesso.' });
  }
  /** metodo para testes */
  async listarTodos(_: Request, res: Response) {
    const repository = getRepository(Usuario);
    const usuarios = await repository.find();

    if (usuarios.length === 0) {
      return res.sendStatus(404);
    }

    return res.json(
      usuarios.map((usario) => ({
        id: usario.id,
        nome: usario.nome,
        email: usario.email,
      }))
    );
  }
}

export default new UsuarioController();
