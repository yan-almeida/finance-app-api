import {
  ManyToOne,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  Column,
} from 'typeorm';
import Categoria from './Categoria';
import Usuario from './Usuario';

@Entity('corCategoria')
class CorCategoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @JoinColumn()
  corCategoria: string;

  @ManyToOne(() => Categoria)
  categoria: number;

  @ManyToOne(() => Usuario)
  usuario: string;
}

export default CorCategoria;
