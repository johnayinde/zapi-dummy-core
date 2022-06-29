import { Category } from 'src/entities/category.entity';
import { DataSource } from 'typeorm';

let dataSource: DataSource;
export const CategoryRepository = dataSource.getRepository(Category).extend({})

