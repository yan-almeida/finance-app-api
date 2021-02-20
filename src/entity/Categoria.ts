import { Column, Entity, ManyToOne } from 'typeorm';
import DefaultColumns from '../util/defaultColumns';
import Lancamento from './Lancamento';
require('dotenv').config();

@Entity('categoria')
class Categoria extends DefaultColumns {
  @Column()
  imagem: string;

  @ManyToOne(() => Lancamento)
  lancamento: Lancamento;
}

export default Categoria;
