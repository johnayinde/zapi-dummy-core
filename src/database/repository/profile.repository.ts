import { Profile } from 'src/entities/profile.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Profile)
export class ProfileRepository extends Repository<Profile> {}
