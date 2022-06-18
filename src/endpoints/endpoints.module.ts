import { Module } from '@nestjs/common';
import { EndpointsService } from './endpoints.service';
import { EndpointsController } from './endpoints.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EndpointRepository } from 'src/database/repository/endpoints.repository';
import { APIRepository } from 'src/database/repository/api.repository';

@Module({
  controllers: [EndpointsController],
  imports: [TypeOrmModule.forFeature([EndpointRepository, APIRepository])],
  providers: [EndpointsService],
})
export class EndpointsModule {}
