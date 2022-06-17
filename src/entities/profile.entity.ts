import { Organisation } from './organisation.entity';
import { SharedEntity } from '../common/model/sharedEntity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Api } from './api.entity';
import { ProfileOrg } from './profile-org.entity';
import { Organisation } from './organisation.entity';


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

  @OneToMany(() => ProfileOrg, (profileOrg) => profileOrg.profile)
  profileOrg: ProfileOrg[];

  @OneToMany(() => Organisation, (organisation) => organisation.profile)
  organisation: Organisation[];
}
