import { ApiProperty } from '@nestjs/swagger';

export class CustomFindDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  value: string;
}
