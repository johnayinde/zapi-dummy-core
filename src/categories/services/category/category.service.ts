import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { v4 as uuid } from 'uuid';
import {
  CreateCategoriesDto,
  FindCategoriesDto,
} from '../../dto/categories.dto';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  createCategory(payload: CreateCategoriesDto): FindCategoriesDto {
    const newCategory = {
      id: uuid(),
      ...payload,
    };
    this.categoryRepository.save(newCategory);
    return newCategory;
  }
}
