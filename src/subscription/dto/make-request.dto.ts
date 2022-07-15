import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { HttpMethod } from '../../common/enums/httpMethods.enum';

export class SubscriptionApiCallDto {
  @IsNotEmpty()
  @ApiProperty()
  method: HttpMethod;

  
  @ApiProperty()
  route: string;

 
  @ApiProperty()
  payload: Object;

  
  @ApiProperty()
  headers: string;
}
