import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryRepository } from 'src/database/repository/category.repository';
import { APIRepository } from 'src/database/repository/api.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryRepository, APIRepository])],
  providers: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
