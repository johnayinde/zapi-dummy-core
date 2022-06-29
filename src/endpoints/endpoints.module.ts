import { Module } from '@nestjs/common';
import { EndpointsService } from './endpoints.service';
import { EndpointsController } from './endpoints.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APIRepository } from 'src/database/repository/api.repository';
import { EndpointRepository } from 'src/database/repository/endpoints.repository';
import { Api } from 'src/entities/api.entity';
import { Endpoint } from 'src/entities/endpoint.entity';

@Module({
  controllers: [EndpointsController],
  imports: [TypeOrmModule.forFeature([Api, Endpoint])],
  providers: [EndpointsService],
})
export class EndpointsModule {}
