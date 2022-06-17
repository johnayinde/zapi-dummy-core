import { SharedEntity } from '../common/model/sharedEntity';
import { Profile } from './profile.entity';
import { OrgRole } from '../common/enums/orgRole.enum';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Organisation } from './organisation.entity';

@Entity()
export class ProfileOrg extends SharedEntity {
  @ManyToOne(() => Organisation, (organisation) => organisation.profileOrg)
  organisation: Organisation;

  @Column()
  organisationId: string;

  @ManyToOne(() => Profile, (profile) => profile.profileOrg)
  profile: Profile;

  @Column()
  profileId: string;

  @Column({
    type: 'enum',
    enum: OrgRole,
    default: OrgRole.DEVELOPER,
  })
  role: OrgRole;
}
