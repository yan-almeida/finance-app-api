import { PrimaryGeneratedColumn, Column } from 'typeorm';

class DefaultColumns {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  descricao: string;
}

export default DefaultColumns;
