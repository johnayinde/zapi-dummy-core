import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class OrganisationDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ default: '5' })
  @IsNotEmpty()
  number_of_seats: number;

  @ApiProperty({ nullable: true })
  number_of_employees?: number;
}
