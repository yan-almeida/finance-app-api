import { hashSync } from 'bcryptjs';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeUpdate,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import Lancamento from './Lancamento';

const SALTS = process.env.SALTS;

@Entity('usuario')
class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column()
  email: string;

  @Column()
  senha: string;

  @OneToMany(() => Lancamento, (lancamento) => lancamento.usuario)
  lancamentos: Lancamento[];

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    this.senha = hashSync(this.senha, parseInt(SALTS));
  }
}

export default Usuario;
