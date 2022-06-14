import { SharedEntity } from '../common/model/sharedEntity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Endpoint } from './endpoint.entity';
import { Discussion } from './discussion.entity';
import { Tutorial } from './tutorial.entity';
import { PriceGroup } from './price-group.entity';
import { Status } from '../common/enums/apiVerification.enum';
import { Profile } from './profile.entity';
import { Category } from './category.entity';
import { Type } from '../common/enums/apiType.enum';
@Entity()
export class Api extends SharedEntity {
  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column()
  base_url: string;

  @Column('text', { array: true, nullable: true, default: [] })
  subscribers: string[];

  @Column({ default: 0 })
  popularity: number;

  @Column({ nullable: true })
  about: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.Unverified,
  })
  status: Status;

  @Column({
    type: 'enum',
    enum: Type,
    default: Type.Public,
  })
  type: Type;

  @Column({ default: 0 })
  rating: number;

  @Column({ default: 0 })
  service_level: number;

  @Column({ default: 0 })
  latency: number;

  @Column()
  categoryId: string;

  @Column()
  profileId: string;

  @Column({ nullable: true })
  endpointsId: string;

  @Column({ nullable: true })
  tutorialsId: string;

  @Column({ nullable: true })
  discussionsId: string;

  @Column({ nullable: true })
  priceGroupId: string;

  @OneToMany(() => Discussion, (discussion) => discussion.api)
  @JoinColumn({ name: 'discussionsId' })
  discussions: Discussion[];

  @ManyToOne(() => Tutorial, (tutorial) => tutorial.api)
  @JoinColumn({ name: 'tutorialsId' })
  tutorials: Tutorial[];

  @OneToMany(() => Endpoint, (endpoint) => endpoint.api)
  @JoinColumn({ name: 'endpointsId' })
  endpoints: Endpoint[];

  @OneToMany(() => PriceGroup, (priceGroup) => priceGroup.api)
  priceGroup: PriceGroup[];

  @ManyToOne(() => Profile, (profile) => profile.apis)
  @JoinColumn({ name: 'profileId' })
  profile: Profile;

  @ManyToOne(() => Category, (category) => category.api)
  @JoinColumn({ name: 'categoryId' })
  category: Category;
}
