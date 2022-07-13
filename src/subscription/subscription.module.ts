import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { Subscription } from '../entities/subscription.entity';
import { Api } from '../entities/api.entity';
import { Profile } from '../entities/profile.entity';
import { Endpoint } from 'src/entities/endpoint.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Subscription,
      Api,
      Profile,
      Endpoint
    ]),
    JwtModule.register({}),
    HttpModule
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}
