import { SharedEntity } from '../common/model/sharedEntity';
import { Column, Entity, ManyToMany } from 'typeorm';
import { Api } from './api.entity';

@Entity()
export class Category extends SharedEntity {
  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToMany(() => Api, (api) => api.categories, { onDelete: 'SET NULL' })
  api: Api[];
}
