import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrganisationDto } from './dto/create-org.dto';
import { OrganisationService } from './organisation.service';
import { OrgUserDto } from './dto/create-user.dto';
import { ZapiResponse } from 'src/common/helpers/response';
import { UpdateOrganisationDto } from './dto/update-org.dto';
import { DeleteUserDto } from './dto/delete-user.dto';

@ApiTags('Organisation')
@Controller('organisation')
export class OrganisationController {
  constructor(private readonly orgService: OrganisationService) {}

  @ApiOperation({ summary: 'Create an organisations' })
  @Post('/:profileId/create')
  async createNewOrganisation(
    @Body() organisationDto: OrganisationDto,
    @Param('profileId') profileId: string,
  ) {
    const organisation = await this.orgService.createOrganisation(
      profileId,
      organisationDto,
    );
    return ZapiResponse.Ok(organisation, 'Created a new organisation', '201');
  }

  @Post('/:profileId/addUser/:id')
  @ApiOperation({ summary: 'Add user to existing organisation' })
  async addUserToOrg(
    @Body() orgUserDto: OrgUserDto,
    @Param('id') id: string,
    @Param('profileId') profileId: string,
  ) {
    const user = await this.orgService.addUserToOrg(id, profileId, orgUserDto);
    return ZapiResponse.Ok(user, 'User added to organisation', '201');
  }

  @Get()
  @ApiOperation({ summary: 'Get all organisations' })
  async getAllOrganisation() {
    const allOrgs = await this.orgService.getAllOrganisation();
    return ZapiResponse.Ok(allOrgs, 'All organisation', '201');
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get one organisations' })
  async getOrganisationById(@Param('id') id: string) {
    const allOrganisation = await this.orgService.findOrganisationById(id);
    return ZapiResponse.Ok(allOrganisation, 'Get one organisation', '200');
  }

  @Get('/users/:id')
  @ApiOperation({ summary: 'Get users of organisation' })
  async getOrgUsers(@Param('id') id: string) {
    const users = await this.orgService.findUsersByOrgId(id);
    return ZapiResponse.Ok(users, 'All users of an organisation', '200');
  }

  @Get('profile/:profileId')
  @ApiOperation({ summary: 'Get organisations of a profile' })
  async getuserOrgs(@Param('profileId') profileId: string) {
    const userOrg = await this.orgService.findOrgsByUser(profileId);
    return ZapiResponse.Ok(userOrg, 'All organisations of a user', 200);
  }

  @Delete('/:profileId/delete/:id')
  @ApiOperation({ summary: 'Delete an existing organisation and its users' })
  async removeOrganisation(
    @Param('id') id: string,
    @Param('profileId') profileId: string,
  ) {
    const deletedOrg = await this.orgService.removeOrganisation(id, profileId);
    return ZapiResponse.Ok(
      deletedOrg,
      'Organisation and teammates deleted',
      '200',
    );
  }

  @Delete('/:profileId/deleteUser/:id/')
  @ApiOperation({ summary: 'Delete a user from organisation' })
  async removeUser(
    @Param('id') id: string,
    @Param('profileId') profileId: string,
    @Body() userEmail: DeleteUserDto,
  ) {
    const deletedUser = await this.orgService.removeUser(
      id,
      profileId,
      userEmail,
    );
    return ZapiResponse.Ok(
      deletedUser,
      'User deleted from the organisation team',
      '200',
    );
  }

  @Put('/:profileId/update/:id')
  @ApiOperation({ summary: 'Update an existing organisation' })
  async updateOrganisation(
    @Body() updateOrganisationDto: UpdateOrganisationDto,
    @Param('id') id: string,
    @Param('profileId') profileId: string,
  ) {
    const updatedOrganisation = await this.orgService.updateOrganisation(
      id,
      profileId,
      updateOrganisationDto,
    );
    return ZapiResponse.Ok(updatedOrganisation, 'Organisation updated', '200');
  }
}
