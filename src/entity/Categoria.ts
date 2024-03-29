import { Column, Entity } from 'typeorm';
import DefaultColumns from '../util/defaultColumns';

@Entity('categoria')
class Categoria extends DefaultColumns {
  @Column()
  blob: string;
}

export default Categoria;
