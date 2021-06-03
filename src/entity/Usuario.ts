import { hashSync } from 'bcryptjs';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import CorCategoria from './CorCategoria';
import Genero from './Genero';
import Lancamento from './Lancamento';
import OrientacaoSexual from './OrientacaoSexual';

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

  @OneToMany(() => CorCategoria, (cor) => cor.categoria)
  cor: CorCategoria[];

  @Column({
    nullable: true,
  })
  apelido: string;

  @Column({
    nullable: true,
  })
  dataNascimento: Date;

  @ManyToOne(() => Genero, { cascade: true })
  @JoinColumn()
  genero: Genero;

  @ManyToOne(() => OrientacaoSexual, { cascade: true })
  @JoinColumn()
  orientacaoSexual: OrientacaoSexual;

  @Column({ default: true })
  ativo: boolean;

  @BeforeInsert()
  hashPassword() {
    this.senha = hashSync(this.senha, parseInt(SALTS));
  }
}

export default Usuario;
