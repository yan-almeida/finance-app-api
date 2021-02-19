import { Router } from 'express';
import AuthController from './controller/AuthController';
import UsuarioController from './controller/UsuarioController';
import salvarUsuarioValidator from './validator/usuario.validator';

const router = Router();

router.post('/usuarios', salvarUsuarioValidator, UsuarioController.salvar);
router.get(
  '/usuarios',
  AuthController.autenticacao,
  UsuarioController.listarTodos
);
router.delete(
  '/usuarios/:id',
  AuthController.autenticacao,
  UsuarioController.deletar
);

export default router;
