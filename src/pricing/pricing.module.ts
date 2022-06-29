import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceGroup } from 'src/entities/price-group.entity';
import { Pricing } from 'src/entities/pricing.entity';
import { PriceGroupRepository } from '../database/repository/price-group.repository';
import { PricingRepository } from '../database/repository/pricing.repository.entity';
import { PricingController } from './pricing.controller';
import { PricingService } from './pricing.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pricing, PriceGroup]),
  ],
  controllers: [PricingController],
  providers: [PricingService]
})
export class PricingModule {}
