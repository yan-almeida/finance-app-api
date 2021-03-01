import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getRepository } from 'typeorm';
import { SalvarUsuarioPayload } from '../@types/usuario';
import Lancamento from '../entity/Lancamento';
import Usuario from '../entity/Usuario';
import { CRequest } from '../util/HTTPUtils';
import { sortBy } from 'sort-by-typescript';
import { pagedList } from '../util/pagedList';

class UsuarioController {
  async salvar(req: CRequest<SalvarUsuarioPayload>, res: Response) {
    const { nome, email, senha } = req.body;

    const repoUsuario = getRepository(Usuario);

    const usuarioExiste = await repoUsuario.findOne({ where: { email } });

    if (usuarioExiste) {
      return res.sendStatus(StatusCodes.CONFLICT);
    }

    const usuario = repoUsuario.create({ nome, email, senha });
    await repoUsuario.save(usuario);

    delete usuario.senha;

    return res.json(usuario);
  }

  async deletar(req: Request, res: Response) {
    const { id } = req.params;

    const repoUsuario = getRepository(Usuario);

    const usuarioExiste = await repoUsuario.findOne({ where: { id } });

    if (!usuarioExiste) {
      return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    await repoUsuario.delete(id);

    return res.json({ message: 'Conta deletada com sucesso.' });
  }

  async listarLancamentosUsuarioTodos(req: CRequest, res: Response) {
    const { page, pageSize, categoriaNome } = req.query;
    const repoLancamento = getRepository(Lancamento);

    const lancamentos = await pagedList<Lancamento>(
      repoLancamento
        .createQueryBuilder('lancamento')
        .select(['lancamento', 'categoria.nome', 'categoria.blob'])
        .innerJoin('lancamento.categoria', 'categoria')
        .orderBy('lancamento.data', 'ASC')
        .where('categoria.nome like :nome', {
          nome: `%${categoriaNome && categoriaNome.trim()}%`,
        })
        .andWhere('lancamento.usuarioId = :id', {
          id: req.userId,
        }),
      {
        page: page ? page : 1,
        limit: pageSize ? pageSize : 10,
      }
    );

    return res.json(lancamentos);
  }

  async listarLancamentoUsuarioDetalhes(req: CRequest, res: Response) {
    const { id } = req.params;
    const repoLancamento = getRepository(Lancamento);

    const lancamentoExiste = await repoLancamento.findOne({
      relations: ['categoria'],
      where: { id, usuario: req.userId },
    });

    if (!lancamentoExiste) {
      return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    return res.json(lancamentoExiste);
  }

  async estatisticasCategoria(_: Request, res: Response) {
    const repoLancamento = getRepository(Lancamento);

    const estatisticasExistem = await repoLancamento
      .createQueryBuilder('lancamento')
      .select(['categoria.nome'])
      .innerJoin('lancamento.categoria', 'categoria')
      .addSelect('COUNT(*) AS porcentagem')
      .orderBy('porcentagem', 'DESC')
      .groupBy('categoria.nome')
      .getRawMany();

    if (estatisticasExistem.length === 0) {
      return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    const porcentagemTotal = estatisticasExistem
      .map((estatistica) => Number(estatistica.porcentagem))
      .reduce((acc, sum) => acc + sum);

    const estatisticaFinal = estatisticasExistem.map((estatistica) => ({
      nome: estatistica.categoria_nome as string,
      porcentagem: (Number(estatistica.porcentagem) / porcentagemTotal) * 100,
    }));

    return res.json(estatisticaFinal);
  }

  async estatisticasDataEntrada(req: Request, res: Response) {
    const repoLancamento = getRepository(Lancamento);

    const lancamentoExiste = await repoLancamento.find({
      where: { usuario: req.userId, entrada: true },
      order: { data: 'ASC' },
      take: 7,
    });

    if (lancamentoExiste.length === 0) {
      return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    return res.json(lancamentoExiste);
  }

  async estatisticasDataSaida(req: Request, res: Response) {
    const repoLancamento = getRepository(Lancamento);

    const lancamentoExiste = await repoLancamento.find({
      where: { usuario: req.userId, entrada: false },
      order: { data: 'ASC' },
      take: 7,
    });

    if (lancamentoExiste.length === 0) {
      return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    return res.json(lancamentoExiste);
  }
}

export default new UsuarioController();
