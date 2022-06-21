import {
  Body,
  Controller,
  Post,
  Get,
  UsePipes,
  ValidationPipe,
  Delete,
  Param,
  ParseUUIDPipe
} from '@nestjs/common';
import { ZapiResponse } from '../common/helpers/response/Response';
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

  @Get()
  async getCategory(): Promise<Ok<Category[]>> {
    const allCategories = await this.categoryservice.getCategory();
    return ZapiResponse.Ok(allCategories, 'Ok', '200');
  }

  @Delete(':id')
  async deleteCategogry(@Param('id', new ParseUUIDPipe()) id: string) {
    const category = await this.categoryservice.deleteCategogry(id);
    return ZapiResponse.Ok(category, 'Ok', '200');
  }

  @Get(':id')
  async findOneById(@Param('id', new ParseUUIDPipe()) id: string) {
    const category = await this.categoryservice.findOneById(id);
    return ZapiResponse.Ok(category, 'Ok', '200');
  }
}
