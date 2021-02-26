import { parseISO } from 'date-fns';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getRepository } from 'typeorm';
import { LancamentoPayload } from '../@types/lancamento';
import Lancamento from '../entity/Lancamento';
import Usuario from '../entity/Usuario';
import { CRequest } from '../util/HTTPUtils';

class LancamentoController {
  async salvar(req: CRequest<LancamentoPayload>, res: Response) {
    const { categoria, descricao, nome, valor, data, entrada } = req.body;

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
      entrada,
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

  async deletar(req: CRequest<{ ids: number[] }>, res: Response) {
    const { ids } = req.body;

    const repoLancamento = getRepository(Lancamento);

    const lancamentoExiste = await repoLancamento.findByIds(ids);

    if (lancamentoExiste.length === 0) {
      return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    const lancamentosId = lancamentoExiste.map((lancamento) => lancamento.id);
    await repoLancamento.delete(lancamentosId);

    return res.json(
      lancamentoExiste.map((lancamento) => ({
        message: `Lancamento ${lancamento.nome} deletado com sucesso.`,
      }))
    );
  }
}

export default new LancamentoController();
