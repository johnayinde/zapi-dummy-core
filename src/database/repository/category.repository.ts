import { BadRequestException } from '@nestjs/common';
import { CreateCategoryDto } from 'src/category/dto/create.category';
import { ZapiResponse } from 'src/common/helpers/response';
import { Category } from 'src/entities/category.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
  async createCategory(categorydto: CreateCategoryDto): Promise<Category> {
    try {
      const { name, description } = categorydto;
      const category = this.create({ name, description });
      await this.save(category);
      return category;
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest(
          'a category with this name already exists, use another name',
        ),
      );
    }
  }
}
