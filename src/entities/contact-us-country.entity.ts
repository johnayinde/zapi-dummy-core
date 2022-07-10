import { Entity, Column } from 'typeorm';
import { SharedEntity } from '../common/model/sharedEntity';

@Entity()
export class ContactUsCountry extends SharedEntity {
  @Column()
  countryName: string;
}
