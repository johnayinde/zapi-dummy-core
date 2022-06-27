import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileRepository } from '../database/repository/profile.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProfileRepository])],
  controllers: [ProfileController],
  providers: [ProfileService]
})
export class ProfileModule {}
