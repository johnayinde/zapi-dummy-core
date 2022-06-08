import { ApiPropertyOptional } from '@nestjs/swagger';

export class CustomFindDto {
  @ApiPropertyOptional()
  name: string;

  @ApiPropertyOptional()
  value: string;
}
