import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getRepository } from 'typeorm';
import { CategoriaPayload } from '../@types/categoria';
import { LancamentoPayload } from '../@types/lancamento';
import Categoria from '../entity/Categoria';
import Lancamento from '../entity/Lancamento';
import { CRequest } from '../util/HTTPUtils';
import { pagedList } from '../util/pagedList';

class CategoriaController {
  async salvar(req: CRequest<CategoriaPayload>, res: Response) {
    const { descricao, nome, url } = req.body;

    const nomeLowerCase = nome.toLowerCase();

    const repoCategoria = getRepository(Categoria);

    const categoriaExiste = await repoCategoria.findOne({
      where: { nome: nomeLowerCase },
    });

    if (categoriaExiste) {
      return res.sendStatus(StatusCodes.CONFLICT);
    }

    const categoria = repoCategoria.create({
      descricao,
      nome: nomeLowerCase,
      url,
    });

    await repoCategoria.save(categoria);

    return res.json(categoria);
  }

  async editar(req: CRequest<LancamentoPayload>, res: Response) {
    const { id } = req.params;

    const repoLancamento = getRepository(Lancamento);

    const lancamentoExiste = await repoLancamento.findOne({
      where: { id },
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

  async buscarUm(req: Request, res: Response, next: NextFunction) {
    const { categoria: id } = req.body;

    const repoCategoria = getRepository(Categoria);

    const categoriaExiste = await repoCategoria.findOne(id);
    if (!categoriaExiste) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .send({ categoria: 'Categoria não encontrada.' });
    }

    return next();
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
