import { Subscription } from 'src/entities/subscription.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Subscription)
export class SubscriptionRepository extends Repository<Subscription> {}
