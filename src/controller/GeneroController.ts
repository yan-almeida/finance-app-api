import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getRepository } from 'typeorm';
import Genero from '../entity/Genero';
import { CRequest } from '../util/HTTPUtils';
require('dotenv').config();

class GeneroController {
  async listarTodos(_: CRequest, res: Response) {
    const repoGenero = getRepository(Genero);
    const generosExistem = await repoGenero.find();

    if (!generosExistem) {
      return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    const generos = generosExistem.map((gen) => {
      const { descricao, ...genero } = gen;

      return genero;
    });

    return res.json(generos);
  }
}

export default new GeneroController();
