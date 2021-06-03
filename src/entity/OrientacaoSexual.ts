import { Entity, JoinColumn, OneToOne } from 'typeorm';
import DefaultColumns from '../util/defaultColumns';

@Entity('orientacaoSexual')
class OrientacaoSexual extends DefaultColumns {}

export default OrientacaoSexual;
