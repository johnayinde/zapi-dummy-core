import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProfileDto {
  @ApiProperty()
  user_id: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  picture: string;
}
