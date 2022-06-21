import { UpdateOrganisationDto } from './dto/update-org.dto';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { OrgRole } from 'src/common/enums/orgRole.enum';
import { ZapiResponse } from 'src/common/helpers/response';
import { OrganisationRepository } from 'src/database/repository/organisation.repository';
import { ProfileRepository } from 'src/database/repository/profile.repository';
import { ProfileOrgRepository } from 'src/database/repository/profileOrg.repository';
import { Organisation } from 'src/entities/organisation.entity';
import { OrganisationDto } from './dto/create-org.dto';
import { OrgUserDto } from './dto/create-user.dto';
import { Profile } from 'src/entities/profile.entity';

@Injectable()
export class OrganisationService {
  constructor(
    private readonly orgRepo: OrganisationRepository,
    private readonly profileOrgRepo: ProfileOrgRepository,
    private readonly profileRepo: ProfileRepository,
  ) {}

  /**
   * Create a new orgainsation in the database
   * And add the profile as the Admin of the organisation
   * @Param {string} profileId - the profile id of the person creating the organisation
   * @Param {OrganisationDto} orgDto - OrganisationDto
   * @returns It returns a promise of the created organisation and organisation teammates
   * */
  async createOrganisation(profileId: string, orgDto: OrganisationDto) {
    try {
      const profile = await this.profileRepo.findOne(profileId);

      if (!profile) {
        throw new BadRequestException(
          ZapiResponse.BadRequest('Not Found', 'Profile does not exist', '404'),
        );
      }

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

      const newOrg = this.orgRepo.create({
        name: orgDto.name,
        number_of_seats: orgDto.number_of_seats,
        number_of_employees: orgDto.number_of_employees,
        price_per_month: 0,
        profile: profile,
        profileId: profile.id,
      });

      const organisationEntry = await this.orgRepo.save(newOrg);
      const orgUsers = await this.addUserToOrg(
        organisationEntry.id,
        profile.id,
        {
          email: profile.email,
          role: OrgRole.ADMIN,
        },
      );
      return { ...organisationEntry, AdminProfileOrg: orgUsers.id };
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Server Error', error, '500'),
      );
    }
  }

  /**
   * It add a new User to the organisation
   * It user is already added or if user does not exist it returns an error
   * @Param {string} id - the organisation id
   * @Param {string} profileId - the profile id of the person creating the organisation
   * @Param {OrgUserDto} orgUserDto -OrgUserDto
   * @returns it returns a promise of the added user
   * */
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
        await this.checkForAdminRole(id, profileId);
      }

      const profile = await this.findUserProfileByEmail(orgUserDto.email);
      if (!profile) {
        throw new BadRequestException(
          ZapiResponse.BadRequest('Not Found', 'Profile does not exist', '404'),
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

  /**
   * Its find User by the organisation id
   * If organisation id does not exist it returns an error
   * @Param {string} id - the organisation id
   * @returns it returns a promise of the user
   * */
  async findUsersByOrg(id: string) {
    try {
      // const organisation = await this.orgRepo.findOne(id);
      return await this.profileOrgRepo.find({
        where: { organisationId: id },
      });
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Server error', error, '500'),
      );
    }
  }

  /**
   * It find organisation by Id
   * if id does not exist it returns an error
   * @Param {string} id - the organisation id
   * @returns a promise of the organisation
   * */
  async findOrganisationById(id: string): Promise<Organisation> {
    try {
      return await this.orgRepo.findOne(id);
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Server error', error, '500'),
      );
    }
  }

  /**Check if the user that is invited to
   * an organisation have an existing profile
   * @Param {OrgUserDto} orgUserDto - OrgUserDto
   * @returns a promise of profile
   * */
  async findUserProfileByEmail(userEmail: string): Promise<Profile> {
    try {
      return await this.profileRepo.findOne({
        where: { email: userEmail },
      });
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Server error', error, '500'),
      );
    }
  }

  /**
   * Its gets all organisation
   * @returns it returns a promise of the all organisation
   * */
  async getAllOrganisation(): Promise<Organisation[]> {
    try {
      return await this.orgRepo.find();
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Server error', error, '500'),
      );
    }
  }

  /**
   * It find an existing organisation by Id and update it
   * if id does not exist it returns an error
   * @Param {string} id - the organisation id
   * @Param {string} profileId - the profile id of Admin
   * @Param {UpdateOrganisationDto} updateOrgDto - UpdateOrganisationDto
   * @returns a promise of the updated organisation
   * */
  async updateOrganisation(
    id: string,
    profileId: string,
    updateOrgDto: UpdateOrganisationDto,
  ) {
    try {
      /*Check if organisation id and Profile Id exist */
      const org = await this.verifyIdsAndReturnOrg(id, profileId);
      if (org) {
        /* checking if Admin is updating*/
        await this.checkForAdminRole(
          id,
          profileId,
          'Only Admin can update organisation',
        );
        await this.orgRepo.update(id, updateOrgDto);
        const updatedOrg = this.orgRepo.findOne(id);
        if (updatedOrg) {
          return updatedOrg;
        } else {
          ZapiResponse.NotFoundRequest(
            'Not Found',
            'Organisation does not exist',
            '404',
          );
        }
      }
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Server error', error, '500'),
      );
    }
  }

  /**
   * It find an existing organisation by Id and remove it
   * if id does not exist it returns an error
   * @Param {string} id - the organisation id
   * @Param {string} profileId - the profile id of Admin
   * @returns a promise of the deleted organisation and organisation teammates
   * */
  async removeOrganisation(id: string, profileId: string) {
    try {
      /*Check if organisation id and Profile Id exist */
      const org = await this.verifyIdsAndReturnOrg(id, profileId);

      if (org) {
        /* checking if Admin is deleting organisation*/
        await this.checkForAdminRole(
          id,
          profileId,
          'Only Admin can delete organisation',
        );
        /**Remove both users and organisation */
        const deletedOrgUsers = await this.removeOrgUsers(org.id);
        const deletedOrg = await this.orgRepo.remove(org);
        return { ...deletedOrg, orgUsers: deletedOrgUsers };
      }
      ZapiResponse.NotFoundRequest(
        'Not Found',
        'Organisation does not exist',
        '404',
      );
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Server error', error, '500'),
      );
    }
  }

  /**
   * It find organisation users by Id and delete all users
   * if id does not exist it returns an error
   * @Param {string} id - the organisation id
   * @returns a promise of the deleted users
   * */
  async removeOrgUsers(id: string) {
    try {
      const users = await this.profileOrgRepo.find({
        where: { organisationId: id },
      });
      return await this.profileOrgRepo.remove(users);
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Server Error', error, '500'),
      );
    }
  }

  /**
   * Remove an organisation user
   * @Param {string} id - the organisation id
   * @Param {string} profileId - the profile id of Admin
   * @Param {string} userEmail - user email
   * @returns a promise of the deleted user
   * */
  async removeUser(id: string, profileId: string, userEmail: string) {
    try {
      /*Check if organisation id and Profile Id exist */
      const org = await this.verifyIdsAndReturnOrg(id, profileId);

      if (org) {
        /* checking if Admin is removing a user*/
        await this.checkForAdminRole(
          id,
          profileId,
          'Only Admin can delete organisation',
        );
        /**Verify email of user */

        const userProfile = await this.findUserProfileByEmail(userEmail);

        const user = await this.profileOrgRepo.find({
          where: { organisationId: org.id, profileId: userProfile.id },
        });
        return await this.profileOrgRepo.remove(user);
      }
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Server error', error, '500'),
      );
    }
  }

  /**
   * check if profile is an admin role in the organisation
   * @Param {string} id - the organisation id
   * @Param {string} profileId - the profile id of Admin
   * @Param {string} error_string - error string
   * @returns a promise of the profileOrg
   * */
  async checkForAdminRole(
    id: string,
    profileId: string,
    error_string = 'Only admin can add user to this organisation',
  ) {
    /* ensure that only admin can add users to org*/
    const user = await this.profileOrgRepo.findOne({
      where: { profileId: profileId, organisationId: id },
    });

    if (user.role !== OrgRole.ADMIN) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Unauthorized', error_string, '401'),
      );
    }
    return;
  }

  /**
   * check if the profile exist and
   * if organisation exist
   * @Param {string} id - the organisation id
   * @Param {string} profileId - the profile id of Admin
   * @returns a promise of the organisation
   * */
  async verifyIdsAndReturnOrg(
    id: string,
    profileId: string,
  ): Promise<Organisation> {
    try {
      const profile = await this.profileRepo.findOne(profileId);
      if (!profile) {
        throw new NotFoundException(
          ZapiResponse.NotFoundRequest(
            'No Found',
            'Profile does not exist',
            '404',
          ),
        );
      }
      const organisation = await this.orgRepo.findOne(id);
      if (!organisation) {
        throw new NotFoundException(
          ZapiResponse.NotFoundRequest(
            'No Found',
            'Organisation does not exist',
            '404',
          ),
        );
      }

      return organisation;
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Server Error', error, '500'),
      );
    }
  }
}
