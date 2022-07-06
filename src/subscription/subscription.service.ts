import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ZapiResponse } from 'src/common/helpers/response';
import { Tokens } from 'src/common/types';
import { Api } from 'src/entities/api.entity';
import { Profile } from 'src/entities/profile.entity';
import { Subscription } from 'src/entities/subscription.entity';
import { Repository } from 'typeorm';
import { createSubscriptionDto } from './dto/create-subscription.dto';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subRepository: Repository<Subscription>,
    @InjectRepository(Api)
    private readonly apiRepository: Repository<Api>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private jwtService: JwtService,
  ) {}

  /**
   * It takes in a createSubscriptionDto object, checks if the user is already subscribed to the api, if not, it creates a subscription, saves it, updates the user's and api's subscriptions array, and returns the
   * tokens.
   * @param {createSubscriptionDto} createSubDto - createSubscriptionDto
   * @returns The subscription object
   */

  async subscribe(createSubDto: createSubscriptionDto): Promise<Tokens> {
    const { profileId, apiId } = createSubDto;
    try {
      const api = await this.apiRepository.findOne({ where: { id: apiId } });
      const profile = await this.profileRepository.findOne({
        where: { id: profileId },
      });

      const subscribed = profile.subscriptions.includes(apiId);

      if (subscribed) {
        throw new BadRequestException(
          ZapiResponse.BadRequest(
            'Existing Subscription',
            'This user is already subscribed to this api',
            '403',
          ),
        );
      } else {
        if (api && profile) {
          const subscription = this.subRepository.create(createSubDto);
          const savedSubscription = await this.subRepository.save(subscription);

          await this.profileRepository.update(profile.id, {
            subscriptions: [...profile.subscriptions, api.id],
          });

          await this.apiRepository.update(api.id, {
            subscriptions: [...api.subscriptions, profile.id],
          });

          return await this.getTokens(
            savedSubscription.apiId,
            savedSubscription.profileId,
          );
        }
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

  async unsubscribe(createSubDto: createSubscriptionDto): Promise<object> {
    const { profileId, apiId } = createSubDto;
    try {
      const api = await this.apiRepository.findOne({ where: { id: apiId } });
      const profile = await this.profileRepository.findOne({
        where: { id: profileId },
      });
      const subscribed = profile.subscriptions.includes(apiId);

      if (subscribed) {
        await this.profileRepository.update(profile.id, {
          subscriptions: [...profile.subscriptions].filter(
            (id) => id !== api.id,
          ),
        });

        await this.apiRepository.update(api.id, {
          subscriptions: [...api.subscriptions].filter(
            (id) => id !== profile.id,
          ),
        });

        return ZapiResponse.Ok('Success', 'Unsubscribe successful', '200');
      } else {
        throw new NotFoundException(
          ZapiResponse.BadRequest(
            'Bad Request',
            'You are not subscribed to this api',
            '400',
          ),
        );
      }
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
