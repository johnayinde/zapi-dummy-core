import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateCategoriesDto {
  @IsNotEmpty()
  @MinLength(3)
  category: string;

  @IsNotEmpty()
  @MinLength(10)
  description: string;

  api?: [];
}
