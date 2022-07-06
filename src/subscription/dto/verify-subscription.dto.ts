import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class VerifySubscriptionDto {
  @IsNotEmpty()
  @ApiProperty()
  token: string;

  
}