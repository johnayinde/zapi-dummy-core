import { ProfileOrg } from 'src/entities/profile-org.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(ProfileOrg)
export class ProfileOrgRepository extends Repository<ProfileOrg> {}
