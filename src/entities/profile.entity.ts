import { SharedEntity } from '../common/model/sharedEntity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Profile extends SharedEntity {
  @Column()
  user_id: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  organization?: string;
}
