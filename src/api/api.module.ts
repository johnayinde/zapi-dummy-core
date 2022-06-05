import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APIRepository } from 'src/database/repository/api.repository';
import { CategoryRepository } from 'src/database/repository/category.repository';

@Module({
  controllers: [ApiController],
  imports: [TypeOrmModule.forFeature([APIRepository, CategoryRepository])],
  providers: [ApiService],
})
export class ApiModule {}
