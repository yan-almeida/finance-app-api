import { Router } from 'express';
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
router.get('/usuario', UsuarioController.listarTodos);
router.get(
  '/usuario/lancamentos',

  LancamentoController.listarLancamentosUsuarioTodos
);
router.delete('/usuario/:id', UsuarioController.deletar);

/** categoria */
router.post('/categoria', salvarCategoriaValidator, CategoriaController.salvar);

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
router.delete('/lancamento', LancamentoController.deletar);

/** autenticação de usuário */
router.post('/auth/sign-in', AuthController.autenticacao);
router.post('/auth/sign-up', salvarUsuarioValidator, UsuarioController.salvar);

export default router;
