import { SharedEntity } from '../common/model/sharedEntity';
import { Profile } from './profile.entity';
import { Organisation } from './organisation.entity';
import { OrgRole } from '../common/enums/orgRole.enum';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class ProfileOrg extends SharedEntity {
  @ManyToOne(() => Organisation, (organisation) => organisation.profileOrg)
  organisation: Organisation;

  @Column()
  profileId: string;

  @ManyToOne(() => Profile, (profile) => profile.profileOrg)
  profile: Profile;

  @Column()
  organisationId: string;

  @Column({
    type: 'enum',
    enum: OrgRole,
    default: OrgRole.DEVELOPER,
  })
  role: OrgRole;
}
