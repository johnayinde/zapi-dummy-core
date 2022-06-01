import { SharedEntity } from '../common/model/sharedEntity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Api } from './api.entity';

@Entity()
export class Category extends SharedEntity {
  @Column({ unique: true })
  category: string;

  @Column()
  description: string;

  @OneToMany(() => Api, (api) => api.category)
  api: Api[];
}
