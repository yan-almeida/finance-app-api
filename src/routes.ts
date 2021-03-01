import { Router } from 'express';
import { uploads } from './config/multer';
import AuthController from './controller/AuthController';
import CategoriaController from './controller/CategoriaController';
import LancamentoController from './controller/LancamentoController';
import UsuarioController from './controller/UsuarioController';
import authMiddleware from './middleware/authMiddleware';
import salvarCategoriaValidator from './validator/categoria.validator';
import salvarLancamentoValidator from './validator/lancamento.validator';
import salvarUsuarioValidator from './validator/usuario.validator';
require('dotenv').config();

const router = Router();

router.use(authMiddleware);

/** usuário */
router.get(
  `${process.env.API}/usuario/lancamentos`,
  UsuarioController.listarLancamentosUsuarioTodos
);
router.get(
  `${process.env.API}/usuario/lancamento/:id`,
  UsuarioController.listarLancamentoUsuarioDetalhes
);
router.get(
  `${process.env.API}/usuario/stats/categoria`,
  UsuarioController.estatisticasCategoria
);
router.get(
  `${process.env.API}/usuario/stats/data-entrada`,
  UsuarioController.estatisticasDataEntrada
);
router.get(
  `${process.env.API}/usuario/stats/data-saida`,
  UsuarioController.estatisticasDataSaida
);
router.delete(`${process.env.API}/usuario/:id`, UsuarioController.deletar);

/** categoria */
router.post(
  `${process.env.API}/categoria`,
  salvarCategoriaValidator,
  uploads.single(`file`),
  CategoriaController.salvar
);
router.get(
  `${process.env.API}/categoria`,
  CategoriaController.listarCategorias
);
router.get(
  `${process.env.API}/categoria/detalhes`,
  CategoriaController.listarCategoriasDetalhes
);

/** lançamento */
router.post(
  `${process.env.API}/lancamento`,
  salvarLancamentoValidator,
  CategoriaController.buscarUm,
  LancamentoController.salvar
);
router.patch(
  `${process.env.API}/lancamento/:id`,
  salvarLancamentoValidator,
  CategoriaController.buscarUm,
  LancamentoController.editar
);
router.delete(
  `${process.env.API}/lancamento/:id`,
  LancamentoController.deletarUm
);
router.delete(
  `${process.env.API}/lancamento`,
  LancamentoController.deletarVarios
);

/** autenticação de usuário */
router.post(`${process.env.API}/auth/sign-in`, AuthController.autenticacao);
router.post(
  `${process.env.API}/auth/sign-up`,
  salvarUsuarioValidator,
  UsuarioController.salvar
);

export default router;
