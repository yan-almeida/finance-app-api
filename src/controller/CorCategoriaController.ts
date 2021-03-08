import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getRepository } from 'typeorm';
import { CorCategoriaType } from '../@types/corCategoria';
import Categoria from '../entity/Categoria';
import CorCategoria from '../entity/CorCategoria';
import { CRequest } from '../util/HTTPUtils';

class CorCategoriaController {
  async salvar(req: CRequest<{ cor: string }>, res: Response) {
    const { cor: corCategoria } = req.body;
    const { categoriaId } = req.params;

    if (!categoriaId) {
      return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    const repoCategoria = getRepository(Categoria);

    const categoriaExiste = await repoCategoria.findOne({
      where: { id: parseInt(categoriaId) },
    });

    if (!categoriaExiste) {
      return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    const repoCorCategoria = getRepository(CorCategoria);

    const corCategoriaExiste = await repoCorCategoria.findOne({
      where: { categoria: categoriaId, usuario: req.userId },
    });

    if (corCategoriaExiste) {
      return res.sendStatus(StatusCodes.CONFLICT);
    }

    const corCategoriaFinal = repoCorCategoria.create({
      corCategoria,
      categoria: parseInt(categoriaId),
      usuario: req.userId,
    });

    await repoCorCategoria.save(corCategoriaFinal);

    return res.json({ message: 'Cor adicionada.' });
  }

  async editar(req: CRequest<CorCategoriaType>, res: Response) {
    const { cor: corCategoria, corId } = req.body;
    const { categoriaId } = req.params;

    if (!categoriaId) {
      return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    const repoCorCategoria = getRepository(CorCategoria);

    const corCategoriaExiste = await repoCorCategoria.findOne({
      where: { categoria: categoriaId, usuario: req.userId, id: corId },
    });

    if (!corCategoriaExiste) {
      return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    const corCategoriaEditar = await repoCorCategoria.preload({
      id: corId,
      ...{ corCategoria },
    });

    await repoCorCategoria.save(corCategoriaEditar);

    return res.json({ message: 'Cor alterada.' });
  }
}

export default new CorCategoriaController();
