import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getRepository } from 'typeorm';
import { CategoriaDetalhes, CategoriaPayload } from '../@types/categoria';
import Categoria from '../entity/Categoria';
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
      return res
        .status(StatusCodes.NOT_FOUND)
        .send(['Categoria não encontrada.']);
    }

    return next();
  }

  async listarCategorias(_: CRequest, res: Response) {
    const repoCategoria = getRepository(Categoria);

    const categoriaExiste = await repoCategoria.find({
      select: ['id', 'nome', 'blob', 'cor'],
    });

    if (categoriaExiste.length === 0) {
      return res.sendStatus(StatusCodes.CONFLICT);
    }

    return res.json(categoriaExiste);
  }

  async listarCategoriaDetalhes(req: Request, res: Response) {
    const { categoriaId } = req.params;

    const repoCategoria = getRepository(Categoria);

    const categoriaExiste = await repoCategoria.findOne(parseInt(categoriaId));
    if (!categoriaExiste) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .send(['Categoria não encontrada.']);
    }

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
      AND
        c."id" = ${categoriaExiste.id}
      `
    )) as CategoriaDetalhes[];

    if (corCategoriaExiste.length === 0) {
      return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    const corCategoria = corCategoriaExiste.filter((categoria) => {
      if (categoria.id == categoriaExiste.id)
        return {
          id: categoria.id,
          nome: categoria.nome,
          descricao: categoria.descricao,
          blob: categoria.blob,
          cor: categoria.corCategoria ? categoria.corCategoria : categoria.cor,
          corId: categoria.corid,
        };
    });

    console.log(categoriaExiste, corCategoria);

    return res.json(corCategoria[0]);
  }
}

export default new CategoriaController();
