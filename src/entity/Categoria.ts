import { Column, Entity } from 'typeorm';
import DefaultColumns from '../util/defaultColumns';

@Entity('categoria')
class Categoria extends DefaultColumns {
  @Column()
  url: string;
}

export default Categoria;
