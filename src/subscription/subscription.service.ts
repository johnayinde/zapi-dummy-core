import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ZapiResponse } from 'src/common/helpers/response';
import { Tokens } from 'src/common/types';
import { APIRepository } from 'src/database/repository/api.repository';
import { ProfileRepository } from 'src/database/repository/profile.repository';
import { SubscriptionRepository } from 'src/database/repository/subscription.repository';
import { createSubscriptionDto } from './dto/create-subscription.dto';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly subRepository: SubscriptionRepository,
    private readonly apiRepository: APIRepository,
    private readonly profileRepository: ProfileRepository,
    private jwtService: JwtService,
  ) {}

  /**
   * It creates a subscription between a profile and an API, and returns the tokens for the subscription
   * @param {createSubscriptionDto} createSubDto - createSubscriptionDto
   * @returns The tokens are being returned.
   */
  async subscribe(createSubDto: createSubscriptionDto): Promise<Tokens> {
    const { profileId, apiId } = createSubDto;
    try {
      const api = await this.apiRepository.findOne(apiId);
      const profile = await this.profileRepository.findOne(profileId);

      if (api && profile) {
        const subscription = this.subRepository.create(createSubDto);
        const savedSubscription = await this.subRepository.save(subscription);

        await this.profileRepository.update(profile.id, {
          subscriptions: [...profile.subscriptions, savedSubscription.id],
        });

        await this.apiRepository.update(api.id, {
          subscriptions: [...api.subscriptions, profile.id],
        });

        return await this.getTokens(
          createSubDto.apiId,
          savedSubscription.profileId,
        );
      }
      throw new NotFoundException(
        ZapiResponse.NotFoundRequest(
          'Not Found',
          'Something went wrong',
          '404',
        ),
      );
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Internal Server error', error.message, '500'),
      );
    }
  }

  /**
   * It takes an apiId and a profileId, and returns a subscriptionToken
   * @param {string} apiId - The id of the API you want to subscribe to.
   * @param {string} profileId - The id of the profile that is subscribing to the API.
   * @returns The subscription token is being returned.
   */
  async getTokens(apiId: string, profileId: string): Promise<Tokens> {
    const subscriptionToken = await this.jwtService.signAsync(
      {
        profileId,
        apiId,
      },
      { secret: process.env.JWT_SUBSCRIPTION_SECRET, expiresIn: 43200 },
    );
    return { subscriptionToken };
  }
}
