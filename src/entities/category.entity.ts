import { SharedEntity } from '../common/model/sharedEntity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Api } from './api.entity';

@Entity()
export class Category extends SharedEntity {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany((_type) => Api, (api) => api.category, { eager: true })
  @JoinColumn()
  api: Api[];
}
