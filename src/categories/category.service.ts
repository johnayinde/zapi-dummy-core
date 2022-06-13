import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ZapiResponse } from 'src/common/helpers/response';
import { Category } from 'src/entities/category.entity';
import { CategoryRepository } from '../database/repository/category.repository';
import { CreateCategoriesDto } from './dto/categories.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async createCategory(payload: CreateCategoriesDto): Promise<Category> {
    try {
      const category = await this.categoryRepository.findOne({
        where: { name: payload.name },
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
        ...payload,
      });
      await this.categoryRepository.save(newCategory);
      return newCategory;
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Server error', error, '500'),
      );
    }
  }

  async getCategory(): Promise<Category[]> {
    try {
      return await this.categoryRepository.find();
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Server error', error, '500'),
      );
    }
  }

  async deleteCategogry(id: string): Promise<Category> {
    try {
      const category = await this.categoryRepository.findOne(id);
      if (category) {
        return await this.categoryRepository.remove(category);
      }
      throw new NotFoundException(
        ZapiResponse.NotFoundRequest(
          'Not Found',
          'Category does not exist',
          '404',
        ),
      );
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Server error', error, '500'),
      );
    }
  }

  async findOneById(id: string): Promise<Category> {
    try {
      const category = await this.categoryRepository.findOne({ where: { id } });
      if (!category) {
        throw new NotFoundException(
          ZapiResponse.NotFoundRequest(
            'Not Found',
            'Category does not exist',
            '404',
          ),
        );
      }
      return category;
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Server error', error, '500'),
      );
    }
  }
}
