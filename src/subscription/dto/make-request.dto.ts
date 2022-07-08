import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { HttpMethod } from '../../common/enums/httpMethods.enum';

export class SubscriptionApiCallDto {
  @IsNotEmpty()
  @ApiProperty()
  method: HttpMethod;

  @IsNotEmpty()
  @ApiProperty()
  route: string;

  @IsNotEmpty()
  @ApiProperty()
  payload: Object;

  
  @ApiProperty()
  headers: string;
}
