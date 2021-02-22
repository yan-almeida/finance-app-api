import { parseISO } from 'date-fns';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getRepository } from 'typeorm';
import { LancamentoPayload } from '../@types/lancamento';
import Lancamento from '../entity/Lancamento';
import Usuario from '../entity/Usuario';
import { CRequest } from '../util/HTTPUtils';
import { pagedList } from '../util/pagedList';

class CategoriaController {
  async salvar(req: CRequest<LancamentoPayload>, res: Response) {
    const { categoria, descricao, nome, valor, data } = req.body;

    const repoLancamento = getRepository(Lancamento);
    const repoUsuario = getRepository(Usuario);

    const usuarioExiste = await repoUsuario.findOne({
      where: { id: req.userId },
    });

    if (!usuarioExiste) {
      return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    const parsedDate = parseISO(data);

    const lancamento = repoLancamento.create({
      categoria,
      descricao,
      nome,
      valor,
      data: parsedDate,
      usuario: req.userId,
    });

    await repoLancamento.save(lancamento);

    return res.json(lancamento);
  }

  async editar(req: CRequest<LancamentoPayload>, res: Response) {
    const { id } = req.params;

    const repoLancamento = getRepository(Lancamento);

    const lancamentoExiste = await repoLancamento.findOne({
      where: { id: id },
    });

    if (!lancamentoExiste) {
      return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    const lancamento = await repoLancamento.preload({
      id: parseInt(id),
      ...req.body,
    });

    await repoLancamento.save(lancamento);

    return res.json(lancamento);
  }

  async listarLancamentosUsuario(req: CRequest, res: Response) {
    const { page, pageSize } = req.query;
    const repoLancamento = getRepository(Lancamento);

    const lancamentos = await pagedList<Lancamento>(
      repoLancamento
        .createQueryBuilder('lancamento')
        .orderBy('lancamento.data', 'ASC')
        .where('lancamento.usuarioId = :id', {
          id: req.userId,
        }),
      {
        page: page ? page : 1,
        limit: pageSize ? pageSize : 10,
      }
    );

    return res.json(lancamentos);
  }
}

export default new CategoriaController();
