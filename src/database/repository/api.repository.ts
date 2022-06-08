import { Api } from 'src/entities/api.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Api)
export class APIRepository extends Repository<Api> {}
