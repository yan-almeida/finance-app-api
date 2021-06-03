import { Entity, JoinColumn, OneToOne } from 'typeorm';
import DefaultColumns from '../util/defaultColumns';

@Entity('genero')
class Genero extends DefaultColumns {}

export default Genero;
