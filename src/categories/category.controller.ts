import {
  Body,
  Controller,
  Post,
  Get,
  UsePipes,
  ValidationPipe,
  Delete,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ZapiResponse } from '../common/helpers/response/Response';
import { Ok } from 'src/common/helpers/response/ResponseType';
import { CategoryService } from './category.service';
import { Category } from '../entities/category.entity';
import { CreateCategoriesDto } from './dto/categories.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IdCheck } from 'src/common/decorators/idcheck.decorator';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryservice: CategoryService) {}

  @Post('create')
  @ApiOperation({summary:'Creates a new category for an api'})
  @UsePipes(ValidationPipe)
  async createCategories(
    @Body()
    post: CreateCategoriesDto,
  ): Promise<Ok<Category>> {
    const category = await this.categoryservice.createCategory(post);
    return ZapiResponse.Ok(category, 'category Created', '201');
  }

  @Get()
  @ApiOperation({summary:'fetches all categories present in the Database'})
  async getCategory(): Promise<Ok<Category[]>> {
    const allCategories = await this.categoryservice.getCategory();
    return ZapiResponse.Ok(allCategories, 'Ok', '200')
  }

  @Delete(':categoryId')
  @IdCheck('categoryId')
  @ApiOperation({summary:'Deletes a single category with the matched categoryId'})
  async deleteCategogry(@Param('categoryId', new ParseUUIDPipe()) categoryId: string) {
    const category = await this.categoryservice.deleteCategogry(categoryId);
    return ZapiResponse.Ok(category, 'Ok', '200');
  }

  @Get(':categoryId')
  @IdCheck('categoryId')
  @ApiOperation({summary:'Fetches a single category with the matched id'})
  async findOneById(@Param('categoryId', new ParseUUIDPipe()) categoryId: string) {
    const category = await this.categoryservice.findOneById(categoryId);
    return ZapiResponse.Ok(category, 'Ok', '200');
  }
}
