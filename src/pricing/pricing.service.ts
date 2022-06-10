import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Pricing } from '../entities/pricing.entity';
import { PricingRepository } from '../database/repository/pricing.repository.entity';
import { PricingDto } from './dto/create-pricing.dto';
import { ZapiResponse } from '../common/helpers/response';
import { PriceGroup } from '../entities/price-group.entity';
import { PriceGroupRepository } from '../database/repository/price-group.repository';

@Injectable()
export class PricingService {
    constructor(
        private readonly pricingRepository: PricingRepository,
        private readonly priceGroupRepository: PriceGroupRepository
    ) {}
    
    async createApiPrice(apiId: string, planName: string, pricings: PricingDto):Promise<PriceGroup> {
        const pricingId = await this.createPricing(planName, pricings);

        const priceGroup = Object.assign(new PriceGroup(), {pricingId}, {apiId})
        const newPriceGroup = await this.priceGroupRepository.save(priceGroup).catch(e => {
            console.log(e)
            throw new BadRequestException(
                ZapiResponse.BadRequest("Error Assigning Price to API")
            )
        });

        return newPriceGroup;
    }

    async createPricing(planName: string, pricing: PricingDto){
        const pricingData = Object.assign(new Pricing(), {planName}, pricing);
        console.log(pricingData);
        const newPricing = await this.pricingRepository.save(pricingData).catch(e => {
            console.log(e)
            throw new BadRequestException(
                ZapiResponse.BadRequest("Error Creating Pricing!")
            )
        });
        return newPricing.id;
    }

}
