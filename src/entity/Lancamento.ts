import { Entity, Column, BeforeInsert, ManyToOne, OneToOne } from 'typeorm';
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
  usuario: string;

  @BeforeInsert()
  dated() {
    this.data = new Date();
  }
}

export default Lancamento;
