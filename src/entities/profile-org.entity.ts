import { SharedEntity } from 'src/common/model/sharedEntity';
import { Profile } from './profile.entity';
import { Organisation } from './organisation.entity';
import { orgRole } from 'src/organisation/orgRole.enum';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';


/* Track multiple profile to multiple organisation */
@Entity()
export class profileOrg extends SharedEntity {
  
  @ManyToOne(() => Organisation, (organisation) => organisation.id)
  organisation_id: string;

  @ManyToOne(() => Profile, (profile) => profile.id)
  profile_id: string; // User email

  @Column() //enum
  role: orgRole;
}
