import { Profile } from './profile.entity';
import { SharedEntity } from '../common/model/sharedEntity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Organisation extends SharedEntity {
  @PrimaryGeneratedColumn('uuid')
  organisation_id: string;

  @Column({ length: 200, unique: true })
  organisation_name: string;

  @Column({ default: '4' })
  number_of_seat: string;

  @Column({ nullable: true })
  number_of_employees: string;

  @Column('uuid', { unique: true })
  @OneToOne(() => Profile, (profile) => profile.email)
  user_email: string; // Profile email that created the organisaion

  @Column({ nullable: true, unique: true })
  mail_extension: string; // mail extension that is unique to the organisation

  @Column('money', { default: '0' })
  // 2 dollar per additional employee after the minimum employee required (4)
  price_per_month: string;
}
