import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { OrganisationService } from './organisation.service';
import { OrganisationController } from './organisation.controller';
import { Organisation } from '../entities/organisation.entity';
import { ProfileOrg } from '../entities/profile-org.entity';
import { Profile } from '../entities/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Organisation, ProfileOrg, Profile])],
  providers: [OrganisationService],
  controllers: [OrganisationController],
})
export class OrganisationModule {}
