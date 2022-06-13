import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'src/common/enums/apiType.enum';
import { CreateApiDto } from './create-api.dto';

export class UpdateApiDto extends PartialType(CreateApiDto) {
  @ApiPropertyOptional()
  name: string;

  @ApiPropertyOptional()
  description: string;

  @ApiPropertyOptional()
  base_url: string;

  @ApiPropertyOptional()
  about: string;

  @ApiPropertyOptional()
  type: Type;
}
