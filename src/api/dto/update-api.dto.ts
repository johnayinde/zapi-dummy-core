import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateApiDto } from './create-api.dto';

export class UpdateApiDto extends PartialType(CreateApiDto) {
  @ApiPropertyOptional()
  name: string;

  @ApiPropertyOptional()
  description: string;

  @ApiPropertyOptional()
  base_url: string;

  @ApiPropertyOptional()
  verified: boolean;

  @ApiPropertyOptional()
  rating: number;

  @ApiPropertyOptional()
  about: string;

  @ApiPropertyOptional()
  category: string;

  @ApiPropertyOptional()
  subscribers: string[];

  @ApiPropertyOptional()
  type: string;
}
