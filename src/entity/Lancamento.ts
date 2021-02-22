import { Entity, Column, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import DefaultColumns from '../util/defaultColumns';
import Categoria from './Categoria';
import Usuario from './Usuario';

@Entity('lancamento')
class Lancamento extends DefaultColumns {
  @Column({ type: 'float' })
  valor: number;

  @Column()
  data: Date;

  @OneToOne(() => Categoria)
  categoria: string;

  @ManyToOne(() => Usuario)
  @JoinColumn()
  usuario: string;
}

export default Lancamento;
