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
  cor: string;

  @ManyToOne(() => Categoria)
  @JoinColumn()
  categoria: Categoria;

  @ManyToOne(() => Usuario)
  @JoinColumn()
  usuario: Categoria;
}

export default CorCategoria;
