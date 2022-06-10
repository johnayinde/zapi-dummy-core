import { IsNotEmpty, IsString } from 'class-validator';

export class PricingDto {
  @IsString()
  @IsNotEmpty()
  planPrice: string;

  @IsString()
  @IsNotEmpty()
  requestDuration: string;
}
