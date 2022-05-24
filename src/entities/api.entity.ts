import { SharedEntity } from '../common/model/sharedEntity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Endpoint } from './endpoint.entity';
import { Category } from './category.entity';
import { Discussion } from './discussion.entity';
import { Tutorial } from './tutorial.entity';
import { IsArray } from 'class-validator';
import { PriceGroup } from './priceGroup.entity';
import { ApiPricing } from './api-pricing.entity';

@Entity()
export class Api extends SharedEntity {
  @Column({ unique: true })
  api_name: string;

  @Column()
  description: string;

  @Column()
  type: string;

  @IsArray()
  @Column({ nullable: true })
  subscribers: string;

  @Column({ nullable: true, default: 0 })
  popularity: number;

  @Column({ nullable: true })
  about: string;

  @Column({ default: false })
  verified: string;

  @Column()
  user_id: string;

  @Column({ nullable: true, default: 0 })
  rating: number;

  @OneToMany(() => Discussion, (discussion) => discussion.api)
  discussions?: Discussion[];

  @ManyToOne(() => Tutorial, (tutorial) => tutorial.api)
  tutorials?: Tutorial[];

  @ManyToMany(() => Category, (category) => category.api)
  @JoinTable()
  categories?: Category[];

  @OneToMany(() => Endpoint, (endpoint) => endpoint.api)
  endpoints: Endpoint[];

  @OneToMany(type => ApiPricing, apiPricing => apiPricing.api) 
  apiPricing: ApiPricing[]

  @OneToOne(() => PriceGroup)
  @JoinColumn()
  pricegroup: PriceGroup[];
}
