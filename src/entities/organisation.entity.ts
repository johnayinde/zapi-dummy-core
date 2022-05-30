import { Profile } from './profile.entity';
import { SharedEntity } from '../common/model/sharedEntity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Organisation extends SharedEntity {
 
  @Column({ length: 200, unique: true })
  organisation_name: string;

  @Column({ default: '4' })
  number_of_seat: string;

  @Column({ nullable: true })
  number_of_employees: string;

  @OneToOne(() => Profile, (profile) => profile.id)
  profile_id: string; // Profile id that created the organisaion

  @Column({ nullable: true, unique: true })
  mail_extension: string; // mail extension that is unique to the organisation

  @Column('money', { default: '0' })
  // Organisation monthly bills based on its number of seats
  price_per_month: string;
}
