import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// USe to test organisation module
export class ProfileDto {
  @ApiProperty()
  user_id: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  picture: string;
}
