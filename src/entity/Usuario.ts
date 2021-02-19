import { hashSync } from 'bcryptjs';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeUpdate,
  BeforeInsert,
} from 'typeorm';
require('dotenv').config();

const SALTS = process.env.SALTS;

@Entity('usuario')
class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  nome: string;

  @Column()
  email: string;

  @Column()
  senha: string;

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    this.senha = hashSync(this.senha, parseInt(SALTS));
  }
}

export default Usuario;
