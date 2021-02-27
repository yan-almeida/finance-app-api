import { Router } from 'express';
import * as multer from 'multer';
import { uploads } from './config/multer';

import AuthController from './controller/AuthController';
import CategoriaController from './controller/CategoriaController';
import LancamentoController from './controller/LancamentoController';
import UsuarioController from './controller/UsuarioController';

import authMiddleware from './middleware/authMiddleware';

import salvarCategoriaValidator from './validator/categoria.validator';
import salvarLancamentoValidator from './validator/lancamento.validator';
import salvarUsuarioValidator from './validator/usuario.validator';

const router = Router();

router.use(authMiddleware);

/** usuário */
router.get(
  '/usuario/lancamentos',
  UsuarioController.listarLancamentosUsuarioTodos
);
router.get(
  '/usuario/lancamento/:id',
  UsuarioController.listarLancamentoUsuarioDetalhes
);
router.get('/usuario/stats/categoria', UsuarioController.estatisticasCategoria);
router.get(
  '/usuario/stats/data-entrada',
  UsuarioController.estatisticasDataEntrada
);
router.get(
  '/usuario/stats/data-saida',
  UsuarioController.estatisticasDataSaida
);
router.delete('/usuario/:id', UsuarioController.deletar);

/** categoria */
router.post(
  '/categoria',
  salvarCategoriaValidator,
  uploads.single('file'),
  CategoriaController.salvar
);
router.get('/categoria', CategoriaController.listarCategorias);
router.get('/categoria/detalhes', CategoriaController.listarCategoriasDetalhes);

/** lançamento */
router.post(
  '/lancamento',
  salvarLancamentoValidator,
  CategoriaController.buscarUm,
  LancamentoController.salvar
);
router.patch(
  '/lancamento/:id',
  salvarLancamentoValidator,
  CategoriaController.buscarUm,
  LancamentoController.editar
);
router.delete('/lancamento/:id', LancamentoController.deletarUm);
router.delete('/lancamento', LancamentoController.deletarVarios);

/** autenticação de usuário */
router.post('/auth/sign-in', AuthController.autenticacao);
router.post('/auth/sign-up', salvarUsuarioValidator, UsuarioController.salvar);

export default router;
