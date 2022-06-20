import { Endpoint } from 'src/entities/endpoint.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Endpoint)
export class EndpointRepository extends Repository<Endpoint> {}
