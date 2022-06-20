import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { OrganisationService } from './organisation.service';
import { OrganisationController } from './organisation.controller';
import { OrganisationRepository } from 'src/database/repository/organisation.repository';
import { ProfileOrgRepository } from 'src/database/repository/profileOrg.repository';
import { ProfileRepository } from 'src/database/repository/profile.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrganisationRepository,
      ProfileOrgRepository,
      ProfileRepository,
    ]),
  ],
  providers: [OrganisationService],
  controllers: [OrganisationController],
})
export class OrganisationModule {}
