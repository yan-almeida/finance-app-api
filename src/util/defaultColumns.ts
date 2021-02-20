import { PrimaryGeneratedColumn, Column } from 'typeorm';

class DefaultColumns {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({
    nullable: true,
  })
  descricao: string;
}

export default DefaultColumns;
