import { parseISO } from 'date-fns';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getRepository } from 'typeorm';
import { LancamentoPayload } from '../@types/lancamento';
import Lancamento from '../entity/Lancamento';
import Usuario from '../entity/Usuario';
import { CRequest } from '../util/HTTPUtils';

class LancamentoController {
  async salvar(req: CRequest<LancamentoPayload>, res: Response) {
    const { categoria, descricao, nome, valor, data, gastou } = req.body;

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
      valor: parseFloat(valor),
      gastou,
      data: parsedDate,
      usuario: req.userId,
    });

    await repoLancamento.save(lancamento);

    return res.json(lancamento);
  }

  async editar(
    req: CRequest<LancamentoPayload & { valor: number }>,
    res: Response
  ) {
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

  async deletarVarios(req: CRequest<{ ids: number[] }>, res: Response) {
    const { ids } = req.body;

    const repoLancamento = getRepository(Lancamento);

    const lancamentosExistem = await repoLancamento.findByIds(ids);

    if (lancamentosExistem.length === 0) {
      return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    const lancamentosId = lancamentosExistem.map((lancamento) => lancamento.id);
    await repoLancamento.delete(lancamentosId);

    return res.json(
      lancamentosExistem.map((lancamento) => ({
        message: `Lancamento ${lancamento.nome} deletado com sucesso.`,
      }))
    );
  }

  async deletarUm(req: Request, res: Response) {
    const { id } = req.params;

    const repoLancamento = getRepository(Lancamento);

    const lancamentoExiste = await repoLancamento.findOne(id);

    if (!lancamentoExiste) {
      return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    await repoLancamento.delete(lancamentoExiste.id);

    return res.json({
      message: `Lancamento ${lancamentoExiste.nome} deletado com sucesso.`,
    });
  }

  async listarUm(req: Request, res: Response) {
    const { id } = req.params;

    const repoLancamento = getRepository(Lancamento);

    const lancamentoExiste = await repoLancamento.findOne(id, {
      relations: ['categoria'],
    });

    if (!lancamentoExiste) {
      return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    const lancamento = {
      id: lancamentoExiste.id,
      nome: lancamentoExiste.nome,
      descricao: lancamentoExiste.descricao,
      valor: lancamentoExiste.valor,
      gastou: lancamentoExiste.gastou,
      data: lancamentoExiste.data,
      categoria: lancamentoExiste.categoria.id,
    };

    return res.json(lancamento);
  }
}

export default new LancamentoController();
