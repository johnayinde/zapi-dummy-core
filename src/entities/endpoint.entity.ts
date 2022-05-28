import { SharedEntity } from '../common/model/sharedEntity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Api } from './api.entity';

@Entity()
export class Endpoint extends SharedEntity {
  @Column()
  title: string;

  @Column()
  http_method: string;

  @Column()
  route: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  route_type: string;

  @ManyToOne(() => Api, (api) => api.endpoints, { onDelete: 'CASCADE' })
  api: Api;
}
