import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ZapiResponse } from 'src/common/helpers/response/Response';
import { Ok } from 'src/common/helpers/response/ResponseType';
import { CategoryService } from './category.service';
import { Category } from '../entities/category.entity';
import { CreateCategoriesDto } from './dto/categories.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryservice: CategoryService) {}

  @Post('create')
  @UsePipes(ValidationPipe)
  async createCategories(
    @Body()
    post: CreateCategoriesDto,
  ): Promise<Ok<Category>> {
    const category = await this.categoryservice.createCategory(post);
    return ZapiResponse.Ok(category, 'category Created', '201');
  }
}
