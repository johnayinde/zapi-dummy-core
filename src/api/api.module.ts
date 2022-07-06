import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Api } from '../entities/api.entity';

@Module({
  controllers: [ApiController],
  imports: [TypeOrmModule.forFeature([Api])],
  providers: [ApiService],
})
export class ApiModule {}
