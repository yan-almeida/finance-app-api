import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getRepository } from 'typeorm';
import { SalvarUsuarioPayload } from '../@types/usuario';
import Lancamento from '../entity/Lancamento';
import Usuario from '../entity/Usuario';
import { CRequest } from '../util/HTTPUtils';
import { pagedList } from '../util/pagedList';
import { EstatisticasCategoriaType } from '../@types/categoria';
import Categoria from '../entity/Categoria';

type IDays = '6 days' | '14 days' | '30 days';

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
        .orderBy('lancamento.data', 'DESC')
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

    if (lancamentos.length === 0) {
      return res.sendStatus(StatusCodes.NOT_FOUND);
    }

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

  async estatisticasCategoria(req: Request, res: Response) {
    const repoCategoria = getRepository(Categoria);

    const estatisticasExistem = (await repoCategoria
      .createQueryBuilder('c')
      .select([
        'c.id id',
        'c.nome nome',
        'c.cor cor',
        'cc.corCategoria corcategoria',
        'cc.id corId',
        'COUNT(l.usuarioId) porcentagem',
      ])
      .innerJoin('lancamento', 'l', 'l.categoriaId = c.id')
      .leftJoin('corCategoria', 'cc', 'c.id = cc.categoriaId')
      .where('l.usuarioId = :id', {
        id: req.userId,
      })
      .orderBy('porcentagem', 'DESC')
      .groupBy('c.nome, c.cor, c.id, cc.corCategoria, cc.id')
      .getRawMany()) as EstatisticasCategoriaType[];

    if (estatisticasExistem.length === 0) {
      return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    const porcentagemTotal = estatisticasExistem
      .map((x) => Number(x.porcentagem))
      .reduce((acc, sum) => acc + sum);

    const estatisticasFinal = estatisticasExistem.map((x) => ({
      id: x.id,
      nome: x.nome,
      porcentagem: ((Number(x.porcentagem) / porcentagemTotal) * 100).toFixed(
        0
      ),
      cor: x.corcategoria ? x.corcategoria : x.cor,
      corId: x.corid,
    }));

    return res.json(estatisticasFinal);
  }

  async estatisticasData(req: Request, res: Response) {
    const repoLancamento = getRepository(Lancamento);

    const days = req.query.filtro ? req.query.filtro : '6 days';
    const gastou = req.query.gastou == 'true' ? true : false;

    const lancamentoExiste = await repoLancamento
      .createQueryBuilder('l')
      .select([
        "CONCAT (EXTRACT(YEAR FROM l.data), '-', EXTRACT(MONTH FROM l.data), '-', EXTRACT(DAY FROM l.data)) periodo",
        'sum(l.valor) total',
      ])
      .where(`l.data > current_date - interval '${days}'`)
      .andWhere('l.gastou = :gastou', {
        gastou,
      })
      .andWhere('l.usuarioId = :id', {
        id: req.userId,
      })
      .groupBy(
        'l.usuarioId, EXTRACT(YEAR FROM l.data), EXTRACT(MONTH FROM l.data), EXTRACT(DAY FROM l.data)'
      )
      .getRawMany();

    if (lancamentoExiste.length === 0) {
      return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    return res.json(lancamentoExiste);
  }
}

export default new UsuarioController();
