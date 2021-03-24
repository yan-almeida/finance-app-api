import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import DefaultColumns from '../util/defaultColumns';
import Categoria from './Categoria';
import Usuario from './Usuario';

@Entity('lancamento')
class Lancamento extends DefaultColumns {
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  valor: number;

  @Column({ nullable: true })
  entrada: boolean;

  @Column()
  data: Date;

  @ManyToOne(() => Categoria)
  @JoinColumn()
  categoria: Categoria;

  @ManyToOne(() => Usuario)
  @JoinColumn()
  usuario: string;
}

export default Lancamento;
