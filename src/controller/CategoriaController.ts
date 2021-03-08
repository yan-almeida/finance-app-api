import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getManager, getRepository } from 'typeorm';
import { CategoriaDetalhes, CategoriaPayload } from '../@types/categoria';
import { LancamentoPayload } from '../@types/lancamento';
import Categoria from '../entity/Categoria';
import CorCategoria from '../entity/CorCategoria';
import Lancamento from '../entity/Lancamento';
import { CRequest } from '../util/HTTPUtils';
require('dotenv').config();

class CategoriaController {
  async salvar(req: CRequest<CategoriaPayload>, res: Response) {
    const { descricao, nome, cor } = req.body;

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
      blob: `http://localhost:3333/${req.file.path}`,
      cor,
    });

    await repoCategoria.save(categoria);

    return res.json(categoria);
  }

  async buscarUm(req: Request, res: Response, next: NextFunction) {
    const { categoria: id } = req.body;

    const repoCategoria = getRepository(Categoria);

    const categoriaExiste = await repoCategoria.findOne(id);
    if (!categoriaExiste) {
      return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    return next();
  }

  async listarCategorias(_: CRequest, res: Response) {
    const repoCategoria = getRepository(Categoria);

    const categoriaExiste = await repoCategoria.find({
      select: ['nome', 'blob', 'cor'],
    });

    if (categoriaExiste.length === 0) {
      return res.sendStatus(StatusCodes.CONFLICT);
    }

    return res.json(categoriaExiste);
  }

  async listarCategoriasDetalhes(req: Request, res: Response) {
    const repoCategoria = getRepository(Categoria);

    const corCategoriaExiste = (await repoCategoria.query(
      `
      SELECT 
        c.*, cc."corCategoria", cc."id" as corId
      FROM 
        categoria c 
      LEFT JOIN 
        "corCategoria" cc 
      ON 
        "c"."id"="cc"."categoriaId"
      AND
        cc."usuarioId" = '${req.userId}'
      `
    )) as CategoriaDetalhes[];

    if (corCategoriaExiste.length === 0) {
      return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    const corCategoria = corCategoriaExiste.map((categoria) => ({
      id: categoria.id,
      nome: categoria.nome,
      descricao: categoria.descricao,
      blob: categoria.blob,
      cor: categoria.corCategoria ? categoria.corCategoria : categoria.cor,
      corId: categoria.corid,
    }));
    return res.json(corCategoria);
  }
}

export default new CategoriaController();
