import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getRepository } from 'typeorm';
import { CategoriaPayload } from '../@types/categoria';
import { LancamentoPayload } from '../@types/lancamento';
import Categoria from '../entity/Categoria';
import Lancamento from '../entity/Lancamento';
import { CRequest } from '../util/HTTPUtils';
require('dotenv').config();

class CategoriaController {
  async salvar(req: CRequest<CategoriaPayload>, res: Response) {
    const { descricao, nome } = req.body;

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
      blob: `${process.env.API}/${req.file.path}`,
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

  async listarCategorias(req: CRequest, res: Response) {
    const repoCategoria = getRepository(Categoria);

    const categoriaExiste = await repoCategoria.find();

    if (categoriaExiste.length === 0) {
      return res.sendStatus(StatusCodes.CONFLICT);
    }

    return res.json(categoriaExiste);
  }
}

export default new CategoriaController();
