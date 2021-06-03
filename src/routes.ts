import { Router } from 'express';
import { uploads } from './config/multer';
import AuthController from './controller/AuthController';
import CategoriaController from './controller/CategoriaController';
import CorCategoriaController from './controller/CorCategoriaController';
import GeneroController from './controller/GeneroController';
import LancamentoController from './controller/LancamentoController';
import OrientacaoSexualController from './controller/OrientacaoSexualController';
import UsuarioController from './controller/UsuarioController';
import authMiddleware from './middleware/authMiddleware';
import salvarCategoriaValidator from './validator/categoria.validator';
import {
  editarCorCategoriaValidator,
  salvarCorCategoriaValidator,
} from './validator/corCategoria.validator';
import salvarLancamentoValidator from './validator/lancamento.validator';
import salvarUsuarioValidator from './validator/usuario.validator';
require('dotenv').config();

const router = Router();

router.use(authMiddleware);

/** gênero */
router.get(`${process.env.API}/generos`, GeneroController.listarTodos);

/** orientação sexual */
router.get(
  `${process.env.API}/orientacaoSexual`,
  OrientacaoSexualController.listarTodos
);

/** usuário */
router.get(
  `${process.env.API}/usuario/lancamentos`,
  UsuarioController.listarLancamentosUsuario
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
  `${process.env.API}/usuario/stats/data`,
  UsuarioController.estatisticasData
);
router.get(
  `${process.env.API}/usuario/stats/ano`,
  UsuarioController.estatisticasAno
);
router.patch(`${process.env.API}/usuario`, UsuarioController.editar);

router.delete(`${process.env.API}/usuario/:id`, UsuarioController.deletar);

/** categoria */
router.post(
  `${process.env.API}/categoria`,
  salvarCategoriaValidator,
  uploads.single(`file`),
  CategoriaController.salvar
);
router.get(
  `${process.env.API}/categorias`,
  CategoriaController.listarCategorias
);
router.get(
  `${process.env.API}/categoria/:categoriaId/detalhes`,
  CategoriaController.listarCategoriaDetalhes
);

router.post(
  `${process.env.API}/categoria/:categoriaId/cor`,
  CategoriaController.buscarUm,
  salvarCorCategoriaValidator,
  CorCategoriaController.salvar
);

router.patch(
  `${process.env.API}/categoria/:categoriaId/cor`,
  CategoriaController.buscarUm,
  editarCorCategoriaValidator,
  CorCategoriaController.editar
);

/** lançamento */
router.post(
  `${process.env.API}/lancamento`,
  CategoriaController.buscarUm,
  salvarLancamentoValidator,
  LancamentoController.salvar
);
router.patch(
  `${process.env.API}/lancamento/:id`,
  salvarLancamentoValidator,
  CategoriaController.buscarUm,
  LancamentoController.editar
);
router.get(`${process.env.API}/lancamento/:id`, LancamentoController.listarUm);
router.delete(
  `${process.env.API}/lancamento/:id`,
  LancamentoController.deletarUm
);
router.delete(
  `${process.env.API}/lancamentos`,
  LancamentoController.deletarVarios
);

/** autenticação de usuário */
router.get(`${process.env.API}/auth/profile`, AuthController.perfil);
router.post(`${process.env.API}/auth/reset-pass`, AuthController.resetarSenha);
router.post(`${process.env.API}/auth/sign-in`, AuthController.autenticacao);
router.post(
  `${process.env.API}/auth/sign-up`,
  salvarUsuarioValidator,
  UsuarioController.salvar
);

export default router;
