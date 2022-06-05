import { SharedEntity } from '../common/model/sharedEntity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Endpoint } from './endpoint.entity';
import { Discussion } from './discussion.entity';
import { Tutorial } from './tutorial.entity';
import { PriceGroup } from './price-group.entity';

@Entity()
export class Api extends SharedEntity {
  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column({ default: 'private' })
  type: string;

  @Column({ nullable: true })
  base_url: string;

  @Column('text', { array: true, nullable: true, default: [] })
  subscribers: string[];

  @Column({ default: 0 })
  popularity: number;

  @Column({ nullable: true })
  about: string;

  @Column()
  profileId: string;

  @Column()
  categoryId: string;

  @Column({ default: false })
  verified: boolean;

  @Column({ default: 0 })
  rating: number;

  @Column({ default: 0 })
  service_level: number;

  @Column({ default: 0 })
  latency: number;

  @OneToMany(() => Discussion, (discussion) => discussion.api)
  discussions: Discussion[];

  @ManyToOne(() => Tutorial, (tutorial) => tutorial.api)
  tutorials: Tutorial[];

  @OneToMany(() => Endpoint, (endpoint) => endpoint.api)
  endpoints: Endpoint[];

  @OneToMany(() => PriceGroup, (priceGroup) => priceGroup.api)
  priceGroup: PriceGroup[];
}
