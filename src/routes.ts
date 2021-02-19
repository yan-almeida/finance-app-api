import { Router } from 'express';
import UsuarioController from './controller/UsuarioController';
import salvarUsuarioValidator from './validators/usuario.validator';

const router = Router();

router.post('/usuarios', salvarUsuarioValidator, UsuarioController.salvar);
router.get('/usuarios', UsuarioController.listarTodos);
router.delete('/usuarios/:id', UsuarioController.deletar);

export default router;
