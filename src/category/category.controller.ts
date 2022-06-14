import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Api } from 'src/entities/api.entity';
import { Category } from 'src/entities/category.entity';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create.category';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/getcategories')
  @ApiOperation({ summary: 'Get an array of al categories' })
  async getAllCategories(): Promise<{ categories: string[] }> {
    const categories = await this.categoryService.getAllCategory();
    return {
      categories: categories.map((category) => category.name),
    };
  }
  @Post('category')
  @ApiOperation({ summary: 'create a category' })
  async CreateCategory(
    @Body() categoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return await this.categoryService.createCategory(categoryDto);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get a single categories with a related apis' })
  getCategoryById(@Param('id') id: string) {
    return this.categoryService.getCategoryById(id);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a category' })
  deleteTask(@Param('id') id: string): Promise<void> {
    return this.categoryService.deleteCategory(id);
  }
}
