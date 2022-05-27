import { SharedEntity } from 'src/common/model/sharedEntity';
import { Entity, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Api } from './api.entity';
import { Pricing } from './pricing.entity';

@Entity()
export class ApiPricing extends SharedEntity {
  @ManyToOne(() => Api, (api) => api.apiPricing, { nullable: true })
  @JoinColumn()
  api: Api;

  @OneToOne(() => Pricing, { nullable: true })
  @JoinColumn()
  pricing: Pricing;
}
