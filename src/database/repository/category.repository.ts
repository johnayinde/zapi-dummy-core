import { Injectable } from '@nestjs/common';
import { Category } from 'src/entities/category.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Category)
@Injectable()
export class CategoryRepository extends Repository<Category> {}
