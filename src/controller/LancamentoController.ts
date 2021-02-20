import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getRepository } from 'typeorm';
import { LancamentoPayload } from '../@types/lancamento';
import Lancamento from '../entity/Lancamento';
import Usuario from '../entity/Usuario';
import { CRequest } from '../util/HTTPUtils';

class LancamentoController {
  async salvar(req: CRequest<LancamentoPayload>, res: Response) {
    const { categoria, descricao, nome, valor } = req.body;

    const repoLancamento = getRepository(Lancamento);
    const repoUsuario = getRepository(Usuario);

    const usuarioExiste = await repoUsuario.findOne({
      where: { id: req.userId },
    });

    if (!usuarioExiste) {
      return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    const lancamento = repoLancamento.create({
      categoria,
      descricao,
      nome,
      valor,
      usuario: req.userId,
    });

    await repoLancamento.save(lancamento);

    return res.json(lancamento);
  }
}

export default new LancamentoController();
