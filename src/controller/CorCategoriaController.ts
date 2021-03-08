import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getRepository } from 'typeorm';
import { CorCategoriaType } from '../@types/corCategoria';
import Categoria from '../entity/Categoria';
import CorCategoria from '../entity/CorCategoria';
import { CRequest } from '../util/HTTPUtils';

class CorCategoriaController {
  async cor(req: CRequest<CorCategoriaType>, res: Response) {
    const { cor: corCategoria, corId } = req.body;
    const { idCategoria } = req.params;

    const repoCategoria = getRepository(Categoria);

    const categoriaExiste = await repoCategoria.findOne(idCategoria);

    if (!categoriaExiste) {
      return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    const repoCorCategoria = getRepository(CorCategoria);

    const corExiste = await repoCorCategoria.findOne({
      where: { id: corId },
    });

    if (!corExiste) {
      return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    const corCategoriaExiste = await repoCorCategoria.findOne({
      where: { categoria: idCategoria, usuario: req.userId },
    });

    if (corId && corCategoriaExiste) {
      const corCategoriaEditar = await repoCorCategoria.preload({
        id: corId,
        ...{ corCategoria },
      });

      await repoCorCategoria.save(corCategoriaEditar);

      return res.json({ message: 'Cor alterada.' });
    }

    const corCategoriaFinal = repoCorCategoria.create({
      corCategoria,
      categoria: parseInt(idCategoria),
      usuario: req.userId,
    });

    await repoCorCategoria.save(corCategoriaFinal);

    return res.json({ message: 'Cor adicionada.' });
  }
}

export default new CorCategoriaController();
