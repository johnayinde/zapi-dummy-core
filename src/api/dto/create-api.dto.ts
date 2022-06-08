import { ApiProperty } from '@nestjs/swagger';
export class CreateApiDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  base_url: string;
}
