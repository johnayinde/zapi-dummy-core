import { Profile } from './profile.entity';
import { SharedEntity } from '../common/model/sharedEntity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ProfileOrg } from './profile-org.entity';


@Entity()
export class Organisation extends SharedEntity {
  @Column({ length: 200, unique: true })
  name: string;

  @Column({ default: 4 })
  number_of_seats: number;

  @Column({ nullable: true })
  number_of_employees: number;

  @Column({ nullable: true })
  mail_extension: string; // mail extension that is unique to the organisation

  @Column({ default: 0 })
  // Organisation monthly bills based on its number of seats
  price_per_month: number;

  @ManyToOne(() => Profile, (profile) => profile.organisation)
  @JoinColumn()
  profile: Profile;

  @OneToMany(() => ProfileOrg, (profileOrg) => profileOrg.organisation)
  @JoinColumn()
  profileOrg: ProfileOrg[];

  @Column()
  profileId: string;
}
