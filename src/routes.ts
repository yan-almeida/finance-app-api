import { Router } from 'express';
import { pagination } from 'typeorm-pagination';
import AuthController from './controller/AuthController';
import LancamentoController from './controller/LancamentoController';
import UsuarioController from './controller/UsuarioController';
import authMiddleware from './middleware/authMiddleware';
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

/** lançamento */
router.post(
  '/lancamento',
  salvarLancamentoValidator,
  LancamentoController.salvar
);

router.delete('/lancamento', LancamentoController.deletar);

router.patch('/lancamento/:id', LancamentoController.editar);

/** autenticação de usuário */
router.post('/auth/sign-in', AuthController.autenticacao);
router.post('/auth/sign-up', salvarUsuarioValidator, UsuarioController.salvar);

export default router;
