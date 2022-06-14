import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryRepository } from 'src/database/repository/category.repository';
import { CreateCategoryDto } from './dto/create.category';
import { Category } from 'src/entities/category.entity';
import { APIRepository } from 'src/database/repository/api.repository';
import { ZapiResponse } from 'src/common/helpers/response';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryRepository)
    private categoryRepository: CategoryRepository,
    @InjectRepository(APIRepository)
    private apiRepository: APIRepository,
  ) {}

  async getAllCategory(): Promise<Category[]> {
    const categories = await this.categoryRepository.find({});
    return categories;
  }
  async createCategory(categorydto: CreateCategoryDto): Promise<Category> {
    return await this.categoryRepository.createCategory(categorydto);
  }

  async getCategoryById(id: string) {
    try {
      const found = await this.categoryRepository.findOne({ id });
      return found;
    } catch (error) {
      if (error.code === '22P02') {
        throw new NotFoundException(
          ZapiResponse.BadRequest(`category with  this ID - ${id} not found`),
        );
      }
    }
  }

  async deleteCategory(id: string): Promise<void> {
    const result = await this.categoryRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(
        ZapiResponse.BadRequest(`Task with  this ID - ${id} not found`),
      );
    }
  }
}
