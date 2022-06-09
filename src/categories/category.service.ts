import { BadRequestException, Injectable } from '@nestjs/common';
import { ZapiResponse } from 'src/common/helpers/response';
import { Category } from 'src/entities/category.entity';
import { v4 as uuid } from 'uuid';
import { CategoryRepository } from '../database/repository/category.repo';
import { CreateCategoriesDto } from './dto/categories.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async createCategory(payload: CreateCategoriesDto): Promise<Category> {
    try {
      const category = await this.categoryRepository.findOne({
        where: { name: CreateCategoriesDto.name },
      });

      if (category) {
        throw new BadRequestException(
          ZapiResponse.BadRequest(
            'Existing Values',
            'An Categorty with this name already exists',
          ),
        );
      }

      const newCategory = this.categoryRepository.create({
        id: uuid(),
        ...payload,
      });
      this.categoryRepository.save(newCategory);
      return newCategory;
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Server error', error, '500'),
      );
    }
  }
}
