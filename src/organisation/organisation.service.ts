import { Injectable, BadRequestException } from '@nestjs/common';
import { OrgRole } from 'src/common/enums/orgRole.enum';
import { ZapiResponse } from 'src/common/helpers/response';
import { OrganisationRepository } from 'src/database/repository/organisation.repository';
import { ProfileRepository } from 'src/database/repository/profile.repository';
import { ProfileOrgRepository } from 'src/database/repository/profileOrg.repository';
import { Organisation } from 'src/entities/organisation.entity';
import { OrganisationDto } from './dto/create-org.dto';
import { OrgUserDto } from './dto/create-user.dto';

@Injectable()
export class OrganisationService {
  constructor(
    private readonly orgRepo: OrganisationRepository,
    private readonly profileOrgRepo: ProfileOrgRepository,
    private readonly profileRepo: ProfileRepository,
  ) {}

  async createOrganisation(profileId: string, orgDto: OrganisationDto) {
    try {
      const organisation = await this.orgRepo.findOne({
        where: { name: orgDto.name },
      });
      if (organisation) {
        throw new BadRequestException(
          ZapiResponse.BadRequest(
            'Unauthorized',
            'An Organisation with this name already exist, use another name',
            '401',
          ),
        );
      }

      const profile = await this.profileRepo.findOne(profileId);

      if (!profile) {
        throw new BadRequestException(
          ZapiResponse.BadRequest('Not Found', 'Profile does not exist', '404'),
        );
      }

      const newOrg = this.orgRepo.create({
        name: orgDto.name,
        number_of_seats: orgDto.number_of_seats,
        number_of_employees: orgDto.number_of_employees,
        price_per_month: 0,
        profile: profile,
        profileId: profile.id,
      });

      const organisationEntry = await this.orgRepo.save(newOrg);
      this.addUserToOrg(organisationEntry.id, profile.id, {
        email: profile.email,
        role: OrgRole.ADMIN,
      });
      return organisationEntry;
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Server Error', error, '500'),
      );
    }
  }

  async addUserToOrg(id: string, profileId: string, orgUserDto: OrgUserDto) {
    try {
      const organisation = await this.orgRepo.findOne(id);
      if (!organisation) {
        throw new BadRequestException(
          ZapiResponse.BadRequest(
            'Not Found',
            'Organisation does not exist',
            '404',
          ),
        );
      }

      // ensure that only admin can add users to org
      if (orgUserDto.role === OrgRole.DEVELOPER) {
        const user = await this.profileOrgRepo.findOne({
          where: { profileId: profileId, organisationId: id },
        });
        if (user.role !== OrgRole.ADMIN) {
          throw new BadRequestException(
            ZapiResponse.BadRequest(
              'Unauthorized',
              'Only admin can add user to this organisation',
              '401',
            ),
          );
        }
      }

      const profile = await this.profileRepo.findOne({
        where: { email: orgUserDto.email },
      });
      if (!profile) {
        throw new BadRequestException(
          ZapiResponse.BadRequest('Not Found', 'User does not exist', '404'),
        );
      }
      const existingUser = await this.profileOrgRepo.findOne({
        where: { profileId: profile.id, organisationId: id },
      });
      if (existingUser) {
        throw new BadRequestException(
          ZapiResponse.BadRequest(
            'Unauthorized',
            'This User is already registered in this organisation',
            '401',
          ),
        );
      }
      const newUser = this.profileOrgRepo.create({
        organisation: organisation,
        organisationId: id,
        profile: profile,
        profileId: profile.id,
        role: orgUserDto.role,
      });
      return await this.profileOrgRepo.save(newUser);
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Internal Server Error', error, '500'),
      );
    }
  }

  async findUsersByOrg(id: string) {
    try {
      const organisation = await this.orgRepo.findOne(id);
      return await this.profileOrgRepo.find({
        where: { organisation: organisation },
      });
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Server error', error, '500'),
      );
    }
  }

  async findOrganisationById(id: string): Promise<Organisation> {
    try {
      return await this.orgRepo.findOne(id);
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Server error', error, '500'),
      );
    }
  }

  async getAllOrganisation(): Promise<Organisation[]> {
    try {
      return await this.orgRepo.find();
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Server error', error, '500'),
      );
    }
  }
}
