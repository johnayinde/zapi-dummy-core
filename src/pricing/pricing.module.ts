import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceGroupRepository } from '../database/repository/price-group.repository';
import { PricingRepository } from '../database/repository/pricing.repository.entity';
import { PricingController } from './pricing.controller';
import { PricingService } from './pricing.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PricingRepository, PriceGroupRepository]),
  ],
  controllers: [PricingController],
  providers: [PricingService]
})
export class PricingModule {}
