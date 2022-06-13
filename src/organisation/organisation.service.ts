import { Injectable, BadRequestException } from '@nestjs/common';
import { OrgRole } from 'src/common/enums/orgRole.enum';
import { ZapiResponse } from 'src/common/helpers/response';
import { OrganisationRepository } from 'src/database/repository/organisation.repository';
import { ProfileRepository } from 'src/database/repository/profile.repository';
import { ProfileOrgRepository } from 'src/database/repository/profileOrg.repository';
import { ProfileOrg } from 'src/entities/profile-org.entity';
// import { ProfileDto } from 'src/organisation/dto/profile-dto';
import { OrganisationDto } from './dto/create-org.dto';
import { OrgUserDto } from './dto/create-user.dto';

@Injectable()
export class OrganisationService {
  constructor(
    private readonly orgRepo: OrganisationRepository,
    private readonly profileOrgRepo: ProfileOrgRepository,
    private readonly profileRepo: ProfileRepository,
  ) {}

  // TO test origanisation module
  // async createProfile(profileDto: ProfileDto) {
  //   const profile = this.profileRepo.create(profileDto);
  //   return await this.profileRepo.save(profile);
  // }

  async createOrganisation(profileId: string, orgDto: OrganisationDto) {
    try {
      const organisation = await this.orgRepo.findOne({
        where: { name: orgDto.name },
      });
      if (organisation) {
        throw new BadRequestException(
          ZapiResponse.BadRequest(
            'Existing Values',
            'An Organisation with this name already exist, use another name',
          ),
        );
      }

      const profile = await this.profileRepo.findOne(profileId);

      const mail_extension = profile.email.substring(
        profile.email.lastIndexOf('@') + 1,
      );

      const newOrg = this.orgRepo.create({
        name: orgDto.name,
        number_of_seats: orgDto.number_of_seats,
        number_of_employees: orgDto.number_of_employees,
        price_per_month: 0,
        profile: profile,
        mail_extension: mail_extension,
      });

      return await this.orgRepo.save(newOrg);
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Server error', error, '500'),
      );
    }
  }

  async addUserToOrg(id: string, orgUserDto: OrgUserDto): Promise<ProfileOrg> {
    try {
      const profile = await this.profileRepo.findOne({
        where: { email: orgUserDto.email },
      });
      if (!profile) {
        throw new BadRequestException(
          ZapiResponse.BadRequest(
            'Non-existing Values',
            'This profile does not exist',
          ),
        );
      }
      const organisation = await this.orgRepo.findOne(id);
      const existingUser = await this.profileOrgRepo.findOne({
        where: { profile: profile, organisation: organisation },
      });
      if (existingUser) {
        throw new BadRequestException(
          ZapiResponse.BadRequest(
            'Existing Values',
            'This User is already registered in this organisation',
          ),
        );
      }
      const newUser = this.profileOrgRepo.create({
        organisation: organisation,
        profile: profile,
        role: orgUserDto.role,
      });
      return await this.profileOrgRepo.save(newUser);
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Server error', error, '500'),
      );
    }
  }

  async findUsersByOrg(id: string) {
    const organisation = this.orgRepo.findOne(id);
    return await this.profileOrgRepo.find({
      where: { organisation: organisation },
    });
  }

  async findOrganisationById(id: string) {
    return await this.orgRepo.findOne(id);
  }

  async getAllOrganisation() {
    return await this.orgRepo.find();
  }
}
