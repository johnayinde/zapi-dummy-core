import { Body, Controller, NotFoundException, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ZapiResponse } from '../common/helpers/response';
import { PriceGroup } from '../entities/price-group.entity';
import { PricingDto } from './dto/create-pricing.dto';
import { PricingService } from './pricing.service';

@ApiTags('Pricing')
@Controller('pricing')
export class PricingController {
    constructor(private pricingService: PricingService) {}

    @Post('/:apiId/basic')
    @ApiOperation({summary: 'Creates Basic Pricing Plan for an API'})
    async createApiBasicPrice(@Body() pricing: PricingDto, @Param('apiId') apiId: string) {
        const planName = 'basic';
        const priceGroup = await this.pricingService.createApiPrice(apiId, planName, pricing)
        if(!priceGroup){
            throw new NotFoundException(
                ZapiResponse.NotFoundRequest('Pricing plan does not exist')
            );
        } 
        
        return ZapiResponse.Ok(priceGroup, 'Basic Pricing created for API', '201');
    }

    @Post('/:apiId/pro')
    @ApiOperation({summary: 'Creates Pro Pricing Plan for an API'})
    async createApiProPrice(@Body() pricing: PricingDto, @Param('apiId') apiId: string) {
        const planName = 'pro';
        const priceGroup = await this.pricingService.createApiPrice(apiId, planName, pricing)
        if(!priceGroup){
            throw new NotFoundException(
                ZapiResponse.NotFoundRequest('Pricing plan does not exist')
            );
        } 
        
        return ZapiResponse.Ok(priceGroup, 'Pro Pricing created for API', '201');
    }

    @Post('/:apiId/ultra')
    @ApiOperation({summary: 'Creates Ultra Pricing Plan for an API'})
    async createApiUltraPrice(@Body() pricing: PricingDto, @Param('apiId') apiId: string) {
        const planName = 'ultra';
        const priceGroup = await this.pricingService.createApiPrice(apiId, planName, pricing)
        if(!priceGroup){
            throw new NotFoundException(
                ZapiResponse.NotFoundRequest('Pricing plan does not exist')
            );
        }   
            
        return ZapiResponse.Ok(priceGroup, 'Ultra Pricing created for API', '201');
    }

    @Post('/:apiId/mega')
    @ApiOperation({summary: 'Creates Mega Pricing Plan for an API'})
    async createApiMegaPrice(@Body() pricing: PricingDto, @Param('apiId') apiId: string) {
        const planName = 'mega';
        const priceGroup = await this.pricingService.createApiPrice(apiId, planName, pricing)
        if(!priceGroup){
            throw new NotFoundException(
                ZapiResponse.NotFoundRequest('Pricing plan does not exist')
            );
        } 
     
        return ZapiResponse.Ok(priceGroup, 'Basic Pricing created for API', '201');
    }
}
