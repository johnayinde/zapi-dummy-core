import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateApiDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  base_url: string;

  @ApiProperty()
  category: string;

  @ApiPropertyOptional()
  subscribers: string[];
}
