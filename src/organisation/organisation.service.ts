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
import { Profile } from 'src/entities/profile.entity';
import { ProfileOrg } from 'src/entities/profile-org.entity';
import { UpdateOrganisationDto } from './dto/update-org.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
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
    /*Get profile by id, return an error if id does not exist */
    const profile = await this.findProfileById(profileId);
    const organisation = await this.orgRepo.findOne({
      where: { name: orgDto.name },
    });
    if (organisation !== null) {
      throw new BadRequestException(
        ZapiResponse.BadRequest(
          'Unauthorized',
          'An Organisation with this name already exist, use another name',
          '401',
        ),
      );
    }

    const newOrg = this.orgRepo.create({
      ...orgDto,
      price_per_month: 0,
      profile: profile,
      profileId: profile.id,
    });

    const organisationEntry = await this.orgRepo.save(newOrg);
    const orgUsers = await this.addUserToOrg(organisationEntry.id, profile.id, {
      email: profile.email,
      role: OrgRole.ADMIN,
    });
    return { ...organisationEntry, AdminProfileOrgId: orgUsers.id };
  }

  /**
   * It add a new User to the organisation
   * @Param id - the organisation id - profileId - the profile id of the person creating the organisation - orgUserDto -OrgUserDto
   * @returns it returns a promise of the added user, throws an error if user is already added or if user profile does not exist it
   * */
  async addUserToOrg(id: string, profileId: string, orgUserDto: OrgUserDto) {
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
    if (existingUser !== null) {
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
  }

  /**
   * It find organisation by Id
   * @Param {string} id - the organisation id
   * @returns a promise of the organisation, throws an error if id does not exist
   * */
  async findOrganisationById(id: string): Promise<Organisation> {
    const org = await this.orgRepo.findOne({ where: { id: id } });
    if (org === null) {
      throw new NotFoundException(
        ZapiResponse.NotFoundRequest(
          'No Found',
          'Organisation does not exist',
          '404',
        ),
      );
    }
    return org;
  }

  /**
   * It find profile by Id
   * @Param {string} id - the profile id
   * @returns a promise of the organisation, throws an error if id does not exist
   * */
  async findProfileById(profileId: string): Promise<Profile> {
    const profile = await this.profileRepo.findOne({
      where: { id: profileId },
    });
    if (profile === null) {
      throw new NotFoundException(
        ZapiResponse.NotFoundRequest(
          'No Found',
          'Profile does not exist',
          '404',
        ),
      );
    }
    return profile;
  }

  /**Check if the user invited to an organisation have an existing profile
   * @Param {string} userEmail - string
   * @returns a promise of profile, throws an error if profile does not exist
   * */
  async findUserProfileByEmail(userEmail: string): Promise<Profile> {
    const profile = await this.profileRepo.findOne({
      where: { email: userEmail },
    });
    if (profile === null) {
      throw new NotFoundException(
        ZapiResponse.NotFoundRequest(
          'No Found',
          'Profile email is does not exist, invite is invalid',
          '404',
        ),
      );
    }
    return profile;
  }

  /**find users by organisation id
   * @Param - profileId: string  -id: string
   * @returns a promise of profileOrg[], throws an error if id does not exist
   * */
  async findUsersByOrgId(id: string): Promise<ProfileOrg[]> {
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
  }

  /**
   * It gets all organisation of a user that has a profile
   * @Param - profileId: string  -id: string
   * @returns a promise of ProfileOrg[], throws an error if profile id does not exist
   */
  async findOrgsByUser(profileId: string): Promise<ProfileOrg[] | null> {
    try {
      const organisations = await this.profileOrgRepo.find({
        where: { profileId: profileId },
      });
      if (organisations.length === 0) {
        return null;
      }
      return organisations;
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Server error', error.message, '500'),
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
   * Remove an organisation user
   * @Param {string} id - the organisation id - profileId - the profile id of Admin - userEmail - user email
   * @returns a promise of the deleted user
   * */
  async removeUser(id: string, profileId: string, orgUser: DeleteUserDto) {
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
      const userProfile = await this.findUserProfileByEmail(orgUser.email);
      const user = await this.checkIfOrgUserExist(id, userProfile.id);

      // admin deleting himself && admin is the only admin
      if (userProfile.id === profileId && user.role === OrgRole.ADMIN) {
        /** check if Admin is deleting removing himself and if Admin is the only one with the admin role
         * then Admin cannot remove himself if he is the only admin*/
        throw new BadRequestException(
          ZapiResponse.BadRequest(
            'Unauthorized',
            'This Admin cannot be deleted, organisation must have at least one Admin, delete organisation instead',
            '401',
          ),
        );
      }
      return await this.profileOrgRepo.remove(user);
    }
  }

  /**
   * It find an existing organisation by Id and update it
   * @Param - id - the organisation id - profileId - the profile id of Admin - updateOrgDto - UpdateOrganisationDto
   * @returns a promise of the updated organisation, throws an error  if id does not exist
   * */
  async updateOrganisation(
    id: string,
    profileId: string,
    updateOrgDto: UpdateOrganisationDto,
  ) {
    /*Check if organisation id and Profile Id exist */
    const org = await this.verifyIdsAndReturnOrg(id, profileId);
    if (org) {
      /* checking if Admin is updating*/
      await this.checkForAdminRole(
        id,
        profileId,
        'Only Admin can update organisation',
      );
      const updatedOrg = await this.orgRepo.update(id, updateOrgDto);
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
  }

  /**
   * check if user is an organisation exist
   * @Param id - the organisation id -profileId - the profile id of Admin
   * @returns a promise of ProfileOrg | throws an error if any id does not exist
   * */
  async checkIfOrgUserExist(
    id: string,
    profileId: string,
  ): Promise<ProfileOrg> {
    /**find a user in organisation, throw an error if any id does not exist */
    const user = await this.profileOrgRepo.findOne({
      where: { profileId: profileId, organisationId: id },
    });
    if (user === null) {
      throw new NotFoundException(
        ZapiResponse.NotFoundRequest('Not Found', 'User not Found', '404'),
      );
    }
    return user;
  }

  /**
   * check if profile is an admin role in the organisation
   * @Param id - the organisation id -profileId - the profile id of Admin - error_string - error string
   * @returns void | throws an error if profile is not admin
   * */
  async checkForAdminRole(
    id: string,
    profileId: string,
    error_string = 'Only admin can add user to this organisation',
  ) {
    /* if role is an Admin, then continue, otherwise, throw an error*/
    const user = await this.checkIfOrgUserExist(id, profileId);
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
    /*Get profile by id, throws an error if id does not exist */
    const profile = await this.findProfileById(profileId);
    if (profile) {
      /*Get org by Id, throws an error if id does not exist*/
      return await this.findOrganisationById(id);
    }
  }
}
