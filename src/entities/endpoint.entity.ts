import { SharedEntity } from '../common/model/sharedEntity';
import { Column, Entity } from 'typeorm';
import { HttpMethod } from '../common/enums/httpMethods.enum';

@Entity()
export class Endpoint extends SharedEntity {
  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: HttpMethod,
    default: HttpMethod.GET,
    nullable: true,
  })
  method: HttpMethod;

  @Column()
  route: string;

  @Column()
  apiId: string;

  @Column()
  description: string;

  @Column('text', {
    array: true,
    nullable: true,
    default: [],
  })
  headers: object[];

  @Column('jsonb', { default: {} })
  requestBody: object;
}
