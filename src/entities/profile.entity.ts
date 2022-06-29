import { Organisation } from './organisation.entity';
import { SharedEntity } from '../common/model/sharedEntity';
import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { ProfileOrg } from './profile-org.entity';
import { Subscription } from './subscription.entity';

@Entity()
export class Profile extends SharedEntity {
  @Column()
  email: string;

  @Column()
  user_id: string;

  @Column('text', { array: true, nullable: true, default: [] })
  subscriptions: string[];

  @Column({ nullable: true })
  picture: string;

  @OneToMany(() => ProfileOrg, (profileOrg) => profileOrg.profile)
  profileOrg: ProfileOrg[];

  @OneToMany(() => Organisation, (organisation) => organisation.profile)
  organisation: Organisation[];

  @OneToMany(() => Subscription, (subscription) => subscription.profile, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'subscriptions' })
  subscription: Subscription[];
}
