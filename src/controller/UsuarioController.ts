import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getRepository, Not, Between } from 'typeorm';
import { EditarUsuarioPayload, SalvarUsuarioPayload } from '../@types/usuario';
import Lancamento from '../entity/Lancamento';
import Usuario from '../entity/Usuario';
import { CRequest } from '../util/HTTPUtils';
import { pagedList } from '../util/pagedList';
import {
  CategoriaDataType,
  EstatisticasCategoriaType,
} from '../@types/categoria';
import Categoria from '../entity/Categoria';
import { groupBy } from '../util/arrayUtils';
import { format } from 'date-fns';

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

  async editar(req: CRequest<Partial<EditarUsuarioPayload>>, res: Response) {
    const repoUsuario = getRepository(Usuario);

    const usuarioExiste = await repoUsuario.findOne({
      where: { id: req.userId },
    });

    if (!usuarioExiste) {
      return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    const usuarioEmailExiste = await repoUsuario.findOne({
      where: { email: req.body.email, id: Not(req.userId) },
    });

    if (usuarioEmailExiste) {
      return res.sendStatus(StatusCodes.CONFLICT);
    }

    const usuario = await repoUsuario.preload({
      id: req.userId,
      ...req.body,
    });

    await repoUsuario.save(usuario);

    const { senha, ...usuarioAtualizado } = await repoUsuario.findOne({
      where: { id: req.userId },
      relations: ['orientacaoSexual', 'genero'],
    });

    return res.json(usuarioAtualizado);
  }

  async deletar(req: Request, res: Response) {
    const repoUsuario = getRepository(Usuario);

    const usuarioExiste = await repoUsuario.findOne({
      where: { id: req.userId },
    });

    if (!usuarioExiste) {
      return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    const usuario = await repoUsuario.preload({
      id: req.userId,
      ...{ ativo: false },
    });

    await repoUsuario.save(usuario);

    return res.json({ message: 'Conta desativada com sucesso.' });
  }

  async listarLancamentosUsuario(req: CRequest, res: Response) {
    const { page, pageSize, categoriaNome } = req.query;
    const repoLancamento = getRepository(Lancamento);

    const lancamentos = await pagedList<Lancamento>(
      repoLancamento
        .createQueryBuilder('lancamento')
        .select(['lancamento', 'categoria.nome', 'categoria.blob'])
        .innerJoin('lancamento.categoria', 'categoria')
        .orderBy('lancamento.id', 'DESC')
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
        1
      ),
      cor: x.corcategoria ? x.corcategoria : x.cor,
      corId: x.corid,
    }));

    return res.json(estatisticasFinal);
  }

  async estatisticasData(req: Request, res: Response) {
    const repoLancamento = getRepository(Lancamento);

    const dias = (req.query.dias ? req.query.dias : 6) as number;
    const gastou = req.query.gastou == 'true' ? true : false;

    const lancamentoExiste = (await repoLancamento
      .createQueryBuilder('l')
      .select([
        "CONCAT (EXTRACT(YEAR FROM l.data), '-', EXTRACT(MONTH FROM l.data), '-', EXTRACT(DAY FROM l.data)) periodo",
        'sum(l.valor) total',
      ])
      .where(`l.data > current_date - interval '${dias} days'`)
      .andWhere('l.gastou = :gastou', {
        gastou,
      })
      .andWhere('l.usuarioId = :id', {
        id: req.userId,
      })
      .groupBy(
        'l.usuarioId, EXTRACT(YEAR FROM l.data), EXTRACT(MONTH FROM l.data), EXTRACT(DAY FROM l.data)'
      )
      .orderBy('periodo')
      .getRawMany()) as CategoriaDataType[];

    if (lancamentoExiste.length === 0) {
      return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    return res.json(lancamentoExiste);
  }

  async estatisticasAno(req: Request, res: Response) {
    const repoLancamento = getRepository(Lancamento);
    const ano = req.query.ano ? req.query.ano : new Date().getFullYear();

    const lancamentosExistem = await repoLancamento.find({
      where: {
        usuario: req.userId,
        data: Between(
          new Date(+ano, 0, 0).toISOString(),
          new Date(+ano, 12, 0).toISOString()
        ),
      },
      relations: ['categoria'],
    });

    if (lancamentosExistem.length === 0) {
      return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    const lancamentos = lancamentosExistem.map((lanc) => {
      const { valor, categoria, data, id, ..._ } = lanc;

      return {
        id,
        valor,
        categoria: categoria.nome,
        data: format(new Date(data), 'yyyy-MM-dd'),
      };
    });

    const estatisticasAno = groupBy(lancamentos, 'data').map((x) => ({
      date: x.key,
      count: x.elements.length,
      lancamentos: x.elements,
    }));

    return res.json(estatisticasAno);
  }
}

export default new UsuarioController();
