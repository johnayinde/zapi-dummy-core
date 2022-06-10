import { SharedEntity } from '../common/model/sharedEntity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Api } from './api.entity';

@Entity()
export class Profile extends SharedEntity {
  @Column()
  email: string;

  @Column()
  user_id: string;

  @Column({ nullable: true })
  picture: string;

  @OneToMany(() => Api, (api) => api.profile)
  apis: Api[];
}
