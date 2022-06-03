import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoryService } from '../../services/category/category.service';
import {
  CreateCategoriesDto,
  FindCategoriesDto,
} from '../../dto/categories.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryservice: CategoryService) {}

  @Post('create')
  @UsePipes(ValidationPipe)
  createCategories(
    @Body()
    post: CreateCategoriesDto,
  ): FindCategoriesDto {
    return this.categoryservice.createCategory(post);
  }
}
