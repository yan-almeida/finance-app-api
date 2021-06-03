import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getRepository } from 'typeorm';
import Genero from '../entity/Genero';
import OrientacaoSexual from '../entity/OrientacaoSexual';
import { CRequest } from '../util/HTTPUtils';
require('dotenv').config();

class OrientacaoSexualController {
  async listarTodos(_: CRequest, res: Response) {
    const repoGenero = getRepository(OrientacaoSexual);
    const orientacaoExistem = await repoGenero.find();

    if (!orientacaoExistem) {
      return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    const orientacos = orientacaoExistem.map((ori) => {
      const { descricao, ...orientacao } = ori;

      return orientacao;
    });

    return res.json(orientacos);
  }
}

export default new OrientacaoSexualController();
