import { Body, Controller, Post } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Ok, ZapiResponse } from '../common/helpers/response';
import { createSubscriptionDto } from './dto/create-subscription.dto';
import { Tokens } from 'src/common/types';

@ApiTags('subscription')
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  /* This is a subscribe post request to the subscription endpoint. */
  @Post('subscribe')
  @ApiOperation({ summary: 'Add a new subscription' })
  async subscribe(
    @Body() createSubDto: createSubscriptionDto,
  ): Promise<Ok<Tokens>> {
    const subscription = await this.subscriptionService.subscribe(createSubDto);
    return ZapiResponse.Ok(subscription, 'Subscription Created', '201');
  }

  /* This is an unsubscribe post request to the subscription endpoint. */
  @Post('unsubscribe')
  @ApiOperation({ summary: 'Unsubscription from an api' })
  async unsubscribe(
    @Body() createSubDto: createSubscriptionDto,
  ): Promise<Ok<object>> {
    const subscription = await this.subscriptionService.unsubscribe(
      createSubDto,
    );
    return ZapiResponse.Ok(subscription, 'Unsubscribed Successfully', '200');
  }
}
