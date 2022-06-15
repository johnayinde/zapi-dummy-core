import { Injectable } from '@nestjs/common';
import { Category } from '../../entities/category.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {}
