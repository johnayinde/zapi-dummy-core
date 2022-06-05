import { SharedEntity } from '../common/model/sharedEntity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Endpoint } from './endpoint.entity';
import { Discussion } from './discussion.entity';
import { Tutorial } from './tutorial.entity';
import { IsArray } from 'class-validator';
import { PriceGroup } from './price-group.entity';
import { Profile } from './profile.entity';
import { Category } from './category.entity';

@Entity()
export class Api extends SharedEntity {
  @Column({ unique: true })
  api_name: string;

  @Column()
  description: string;

  @Column({ default: 'private' })
  type: string;

  @Column()
  base_url: string;

  @IsArray()
  @Column({ nullable: true })
  subscribers?: string;

  @Column({ nullable: true, default: 0 })
  popularity?: number;

  @Column({ nullable: true })
  about: string;

  @Column({ default: false })
  verified?: string;

  @Column({ nullable: true, default: 0 })
  rating?: number;

  @OneToMany(() => Discussion, (discussion) => discussion.api)
  discussions?: Discussion[];

  @ManyToOne(() => Tutorial, (tutorial) => tutorial.api)
  tutorials?: Tutorial[];

  @OneToMany(() => Endpoint, (endpoint) => endpoint.api)
  endpoints?: Endpoint[];

  @OneToMany(() => PriceGroup, (priceGroup) => priceGroup.api)
  priceGroup?: PriceGroup[];

  @ManyToOne(() => Category, (category) => category.api)
  category: Category;
  @OneToOne(() => Profile)
  @JoinColumn()
  profile?: Profile;
}
