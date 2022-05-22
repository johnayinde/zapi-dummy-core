import { SharedEntity } from '../common/model/sharedEntity';
import { Entity } from 'typeorm';

@Entity()
export class PriceGroup extends SharedEntity {}
