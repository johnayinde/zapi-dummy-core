import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { OrgRole } from 'src/common/enums/orgRole.enum';
import { ZapiResponse } from 'src/common/helpers/response';
import { Organisation } from '../entities/organisation.entity';
import { OrganisationDto } from './dto/create-org.dto';
import { OrgUserDto } from './dto/create-user.dto';
import { Profile } from '../entities/profile.entity';
import { ProfileOrg } from '../entities/profile-org.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OrganisationService {
  constructor(
    @InjectRepository(Organisation)
    private readonly orgRepo: Repository<Organisation>,
    @InjectRepository(ProfileOrg)
    private readonly profileOrgRepo: Repository<ProfileOrg>,
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
  ) {}

  /**
   * Create a new orgainsation in the database, and add the profile as the Admin of the organisation
   * @Param profileId - the profile id of the person creating the organisation - orgDto - OrganisationDto
   * @returns It returns a promise of the created organisation and organisation teammates, throws an error if organisation or profile already exist
   * */
  async createOrganisation(profileId: string, orgDto: OrganisationDto) {
    try {
      /*Get profile by id, return an error if id does not exist */
      const profile = await this.findProfileById(profileId);
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
      return { ...organisationEntry, AdminProfileOrgId: orgUsers.id };
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Server Error', error.message, '500'),
      );
    }
  }

  /**
   * It add a new User to the organisation
   * @Param id - the organisation id - profileId - the profile id of the person creating the organisation - orgUserDto -OrgUserDto
   * @returns it returns a promise of the added user, throws an error if user is already added or if user profile does not exist it
   * */
  async addUserToOrg(id: string, profileId: string, orgUserDto: OrgUserDto) {
    try {
      /*Get organisation by Id, return an error if id does not exist*/
      const organisation = await this.findOrganisationById(id);

      // ensure that only admin can add users to org, else throws an error
      if (orgUserDto.role === OrgRole.DEVELOPER) {
        await this.checkForAdminRole(id, profileId);
      }
      /*Get profile by email, return an error if email does not exist*/
      const profile = await this.findUserProfileByEmail(orgUserDto.email);
      const existingUser = await this.profileOrgRepo.findOne({
        where: { profileId: profile.id, organisationId: id },
      });
      if (existingUser) {
        throw new BadRequestException(
          ZapiResponse.BadRequest(
            'Unauthorized',
            'This user is already registered in this organisation',
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
        ZapiResponse.BadRequest('Internal Server Error', error.message, '500'),
      );
    }
  }

  /**
   * It find organisation by Id
   * @Param {string} id - the organisation id
   * @returns a promise of the organisation, throws an error if id does not exist
   * */
  async findOrganisationById(id: string): Promise<Organisation> {
    try {
      const org = await this.orgRepo.findOne({where : { id }});
      if (!org) {
        throw new NotFoundException(
          ZapiResponse.NotFoundRequest(
            'No Found',
            'Organisation does not exist',
            '404',
          ),
        );
      }
      return org;
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Server error', error.message, '500'),
      );
    }
  }

  /**
   * It find profile by Id,
   * @Param {string} id - the profile id
   * @returns a promise of the organisation, throws an error if id does not exist
   * */
  async findProfileById(profileId: string): Promise<Profile> {
    try {
      const profile = await this.profileRepo.findOne({where : { id: profileId}});
      if (!profile) {
        throw new NotFoundException(
          ZapiResponse.NotFoundRequest(
            'No Found',
            'Profile does not exist',
            '404',
          ),
        );
      }
      return profile;
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Server error', error.message, '500'),
      );
    }
  }

  /**Check if the user invited to an organisation have an existing profile
   * @Param {string} userEmail - string
   * @returns a promise of profile, throws an error if profile does not exist
   * */
  async findUserProfileByEmail(userEmail: string): Promise<Profile> {
    try {
      const profile = await this.profileRepo.findOne({
        where: { email: userEmail },
      });
      if (!profile) {
        throw new NotFoundException(
          ZapiResponse.NotFoundRequest(
            'No Found',
            'Profile email is does not exist, invite is invalid',
            '404',
          ),
        );
      }
      return profile;
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Server error', error.message, '500'),
      );
    }
  }

  /**find users by organisation id
   * @Param - profileId: string  -id: string
   * @returns a promise of profileOrg[], throws an error if id does not exist
   * */
  async findUsersByOrgId(id: string): Promise<ProfileOrg[]> {
    try {
      // check if org exist, else throws an error
      const org = await this.findOrganisationById(id);
      if (org) {
        const users = await this.profileOrgRepo.find({
          where: { organisationId: id },
        });
        if (users.length === 0) {
          throw new NotFoundException(
            ZapiResponse.NotFoundRequest(
              'Not Found',
              'Users not Found in this organisation',
              '404',
            ),
          );
        }
        return users;
      }
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Server Error', error.message, '500'),
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
        ZapiResponse.BadRequest('Server error', error.message, '500'),
      );
    }
  }

  /**
   * It find an existing organisation by Id and remove it
   * @Param id - the organisation id - profileId - the profile id of Admin
   * @returns a promise of the deleted organisation and organisation teammates, returns an error if id does not exist
   * */
  async removeOrganisation(id: string, profileId: string) {
    try {
      /*Check if organisation id and Profile Id exist otherwise throws an error */
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
        return { ...deletedOrg, organisationUsers: deletedOrgUsers };
      }
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Server error', error.message, '500'),
      );
    }
  }

  /**
   * It find organisation users by Id and delete all users,
   * @Param {string} id - the organisation id
   * @returns a promise of the deleted users, throws an error if id not not exist
   * */
  async removeOrgUsers(id: string) {
    try {
      // find users by organisation id, throws an error if id does not exist
      const users = await this.findUsersByOrgId(id);
      return await this.profileOrgRepo.remove(users);
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Server Error', error.message, '500'),
      );
    }
  }

  /**
   * check if profile is an admin role in the organisation
   * @Param id - the organisation id -profileId - the profile id of Admin - error_string - error string
   * @returns a promise of the profileOrg
   * */
  async checkForAdminRole(
    id: string,
    profileId: string,
    error_string = 'Only admin can add user to this organisation',
  ) {
    /**find a user in organisation, throw an error if any id does not exist */
    const user = await this.profileOrgRepo.findOne({
      where: { profileId: profileId, organisationId: id },
    });
    if (!user) {
      throw new NotFoundException(
        ZapiResponse.NotFoundRequest('Not Found', 'User not Found', '404'),
      );
    }
    /* if role is an Admin, then continue, otherwise, throw an error*/
    if (user.role !== OrgRole.ADMIN) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Unauthorized', error_string, '401'),
      );
    }
    return;
  }

  /**
   * check if the profile exist and if organisation exist
   * @Param {string} id - the organisation id - profileId - the profile id of Admin
   * @returns a promise of the organisation, throws an error if profile or organisation does not exist
   * */
  async verifyIdsAndReturnOrg(
    id: string,
    profileId: string,
  ): Promise<Organisation> {
    try {
      /*Get profile by id, throws an error if id does not exist */
      const profile = await this.findProfileById(profileId);
      if (profile) {
        /*Get org by Id, throws an error if id does not exist*/
        return await this.findOrganisationById(id);
      }
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Server Error', error.message, '500'),
      );
    }
  }
}
