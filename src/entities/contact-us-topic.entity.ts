import { Entity, Column } from 'typeorm';
import { SharedEntity } from '../common/model/sharedEntity';

@Entity()
export class ContactUsTopic extends SharedEntity {
  @Column()
  topicName: string;
}
