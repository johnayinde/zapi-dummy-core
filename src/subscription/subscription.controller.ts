import { Body, Controller, Param, Post } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Ok, ZapiResponse } from '../common/helpers/response';
import { createSubscriptionDto } from './dto/create-subscription.dto';
import { Tokens } from 'src/common/types';
import { VerifySubscriptionDto } from './dto/verify-subscription.dto';

@ApiTags('subscription')
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  /* This is a post request to the subscription endpoint. */
  @Post('subscribe')
  @ApiOperation({ summary: 'Add a new subscription' })
  async create(
    @Body() createSubDto: createSubscriptionDto,
  ): Promise<Ok<Tokens>> {
    const subscription = await this.subscriptionService.subscribe(createSubDto);
    return ZapiResponse.Ok(subscription, 'Subscription Created', '201');
  }

  @Post('api-request/:token')
  @ApiOperation({summary: 'Check subscription status of user to the api'})
  async verify(
    @Param("token") verifysub: string,
  ):Promise<Ok<Object>>{
    const verifySubscription = await this.subscriptionService.verifySub(verifysub)
    return ZapiResponse.Ok(verifySubscription, 'user is subcribed to this api', '200')
  }
}
