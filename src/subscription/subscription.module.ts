import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionRepository } from '../database/repository/subscription.repository';
import { JwtModule } from '@nestjs/jwt';
import { APIRepository } from '../database/repository/api.repository';
import { ProfileRepository } from '../database/repository/profile.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SubscriptionRepository,
      APIRepository,
      ProfileRepository,
    ]),
    JwtModule.register({}),
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}
