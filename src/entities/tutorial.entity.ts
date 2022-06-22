import { SharedEntity } from '../common/model/sharedEntity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Tutorial extends SharedEntity {
  @Column()
  title: string;

  @Column()
  body: string;

  @Column()
  apiId: string;
}
