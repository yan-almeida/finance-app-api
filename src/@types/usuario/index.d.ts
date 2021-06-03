import Genero from '../../entity/Genero';
import OrientacaoSexual from '../../entity/OrientacaoSexual';

export type SalvarUsuarioPayload = {
  nome: string;
  email: string;
  senha: string;
};

export type EditarUsuarioPayload = {
  nome: string;
  email: string;
  apelido: string;
  dataNascimento: Date;
  orientacaoSexual: OrientacaoSexual;
  genero: Genero;
};

export type AuthUsuarioPayload = {
  email: string;
  senha: string;
};
