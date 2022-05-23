import { SharedEntity } from '../common/model/sharedEntity';
import { Column, Entity, OneToOne } from 'typeorm';
import { Api } from './api.entity';

@Entity()
export class Tutorial extends SharedEntity {
  @Column()
  body: string;

  @OneToOne(() => Api, (api) => api.tutorials, { onDelete: 'CASCADE' })
  api: Api;
}
