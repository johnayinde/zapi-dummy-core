import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class DeleteUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}
