import { Module } from '@nestjs/common';
import { EndpointsService } from './endpoints.service';
import { EndpointsController } from './endpoints.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Api } from '../entities/api.entity';
import { Endpoint } from '../entities/endpoint.entity';

@Module({
  controllers: [EndpointsController],
  imports: [TypeOrmModule.forFeature([Api, Endpoint])],
  providers: [EndpointsService],
})
export class EndpointsModule {}
