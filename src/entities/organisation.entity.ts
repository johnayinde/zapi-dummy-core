import { Profile } from './profile.entity';
import { SharedEntity } from '../common/model/sharedEntity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity()
export class Organisation extends SharedEntity {
  @Column({ length: 200, unique: true })
  organisation: string;

  @Column({ default: '4' })
  number_of_seats: string;

  @Column({ nullable: true })
  number_of_employees: string;

  @Column({ nullable: true })
  mail_extension: string; // mail extension that is unique to the organisation

  @Column({ default: 0 })
  // Organisation monthly bills based on its number of seats
  price_per_month: number;

  @OneToOne(() => Profile)
  @JoinColumn()
  profile: Profile;
}
