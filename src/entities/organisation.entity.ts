import { Profile } from './profile.entity';
import { SharedEntity } from '../common/model/sharedEntity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

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

  @ManyToOne(() => Profile)
  @JoinColumn()
  profile: Profile;
}
