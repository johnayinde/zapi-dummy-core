import { Body, Controller, Get, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IdCheckGuard } from 'src/common/guards/idcheck.guard';
import { ZapiResponse } from '../common/helpers/response';
import { PricingDto } from './dto/create-pricing.dto';
import { PricingService } from './pricing.service';

@ApiTags('Pricing')
@Controller('pricing')
export class PricingController {
    constructor(private pricingService: PricingService) {}

    /** 
     * This post request takes apiId as @Param() & pricingDto (planPrice & requestDuration) in the body
     * Creates basic pricing plan for an api
     * Returns the api & along with the created plan 
     */
    @Post('/:apiId/basic')
    @UseGuards(IdCheckGuard)
    @ApiOperation({summary: 'Creates Basic Pricing Plan for an API'})
    async createApiBasicPrice(@Body() pricing: PricingDto, @Param('apiId') apiId: string) {
        //the planName is hardcoded
        const planName = 'basic';
        const priceGroup = await this.pricingService.createApiPrice(apiId, planName, pricing);
        return ZapiResponse.Ok(priceGroup, 'Basic Pricing created for API', '201');
    }

    /** 
     * This post request takes apiId as @Param() & pricingDto (planPrice & requestDuration) in the body
     * Creates pro pricing plan for an api
     * Returns the api & along with the created plan 
     */
    @Post('/:apiId/pro')
    @UseGuards(IdCheckGuard)
    @ApiOperation({summary: 'Creates Pro Pricing Plan for an API'})
    async createApiProPrice(@Body() pricing: PricingDto, @Param('apiId') apiId: string) {
        //the planName is hardcoded
        const planName = 'pro';
        const priceGroup = await this.pricingService.createApiPrice(apiId, planName, pricing);
        return ZapiResponse.Ok(priceGroup, 'Pro Pricing created for API', '201');
    }

    /** 
     * This post request takes apiId as @Param() & pricingDto (planPrice & requestDuration) in the body
     * Creates ultra pricing plan for an api
     * Returns the api & along with the created plan 
     */
    @Post('/:apiId/ultra')
    @UseGuards(IdCheckGuard)
    @ApiOperation({summary: 'Creates Ultra Pricing Plan for an API'})
    async createApiUltraPrice(@Body() pricing: PricingDto, @Param('apiId') apiId: string) {
        //the planName is hardcoded
        const planName = 'ultra';
        const priceGroup = await this.pricingService.createApiPrice(apiId, planName, pricing); 
        return ZapiResponse.Ok(priceGroup, 'Ultra Pricing created for API', '201');
    }

    /** 
     * This post request takes apiId as @Param() & pricingDto (planPrice & requestDuration) in the body
     * Creates mega pricing plan for an api
     * Returns the api & along with the created plan 
     */
    @Post('/:apiId/mega')
    @UseGuards(IdCheckGuard)
    @ApiOperation({summary: 'Creates Mega Pricing Plan for an API'})
    async createApiMegaPrice(@Body() pricing: PricingDto, @Param('apiId') apiId: string) {
        //the planName is hardcoded
        const planName = 'mega';
        const priceGroup = await this.pricingService.createApiPrice(apiId, planName, pricing);
        return ZapiResponse.Ok(priceGroup, 'Basic Pricing created for API', '201');
    }

    /** 
     * This get request takes apiId as @Param() and then returns all the pricing plans  
     * for the specified api
     */
    @Get('/:apiId/price')
    @UseGuards(IdCheckGuard)
    @ApiOperation({summary: 'Retrieves all the Pricing Plans for an API'})
    async getApiPrices(@Param('apiId') apiId: string) {
        const priceData = await this.pricingService.getApiPricing(apiId);
        if (!priceData)
            ZapiResponse.Ok(
                'Not Found',
                'Pricing plan does not exist for this API',
                '404',
            );
        return ZapiResponse.Ok(priceData, 'Ok', '200');
    }
}
