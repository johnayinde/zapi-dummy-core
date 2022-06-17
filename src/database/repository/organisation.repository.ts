import { Organisation } from 'src/entities/organisation.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Organisation)
export class OrganisationRepository extends Repository<Organisation> {}
