import { Profile } from './profile.entity';
import { Organisation } from './organisation.entity';
import { orgRole } from 'src/organisation/orgRole.enum';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';


/* Track multiple profile to multiple organisation */
@Entity()
export class profileOrg {
  @PrimaryColumn('uuid')
  @ManyToOne(() => Organisation, (organisation) => organisation.organisation_id)
  organisation_id: string;

  @ManyToOne(() => Profile, (profile) => profile.email)
  email: string; // User email

  @Column() //enum
  role: orgRole;
}
