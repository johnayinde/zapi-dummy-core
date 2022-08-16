import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  SetMetadata,
  UseGuards
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrganisationDto } from './dto/create-org.dto';
import { OrganisationService } from './organisation.service';
import { OrgUserDto } from './dto/create-user.dto';
import { ZapiResponse } from 'src/common/helpers/response';
import { UpdateOrganisationDto } from './dto/update-org.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { IdCheckGuard } from 'src/common/guards/idcheck.guard';
import { IdCheck } from 'src/common/decorators/idcheck.decorator';

@ApiTags('Organisation')
@Controller('organisation')
export class OrganisationController {
  constructor(private readonly orgService: OrganisationService) {}

  @ApiOperation({ summary: 'Create an organisations' })
  @Post('/:profileId/create')
  @IdCheck('profileId')
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

  @Post('/:profileId/addUser/:organisationId')
  @IdCheck('profileId', 'organisationId')
  @ApiOperation({ summary: 'Add user to existing organisation' })
  async addUserToOrg(
    @Body() orgUserDto: OrgUserDto,
    @Param('organisationId') organisationId: string,
    @Param('profileId') profileId: string,
  ) {
    const user = await this.orgService.addUserToOrg(organisationId, profileId, orgUserDto);
    return ZapiResponse.Ok(user, 'User added to organisation', '201');
  }

  @Get()
  @ApiOperation({ summary: 'Get all organisations' })
  async getAllOrganisation() {
    const allOrgs = await this.orgService.getAllOrganisation();
    return ZapiResponse.Ok(allOrgs, 'All organisation', '201');
  }

  @Get('/:organisationId')
  @IdCheck('organisationId')
  @ApiOperation({ summary: 'Get one organisations' })
  async getOrganisationById(@Param('organisationId') organisationId: string) {
    const allOrganisation = await this.orgService.findOrganisationById(organisationId);
    return ZapiResponse.Ok(allOrganisation, 'Get one organisation', '200');
  }

  @Get('/users/:organisationId')
  @IdCheck('organisationId')
  @ApiOperation({ summary: 'Get users of organisation' })
  async getOrgUsers(@Param('organisationId') organisationId: string) {
    const users = await this.orgService.findUsersByOrgId(organisationId);
    return ZapiResponse.Ok(users, 'All users of an organisation', '200');
  }

  @Delete('/:profileId/delete/:organisationId')
  @IdCheck('profileId', 'organisationId')
  @ApiOperation({ summary: 'Delete an existing organisation and its users' })
  async removeOrganisation(
    @Param('organisationId') organisationId: string,
    @Param('profileId') profileId: string,
  ) {
    const deletedOrg = await this.orgService.removeOrganisation(organisationId, profileId);
    return ZapiResponse.Ok(
      deletedOrg,
      'Organisation and teammates deleted',
      '200',
    );
  }

  @Delete('/:profileId/deleteUser/:organisationId/')
  @IdCheck('profileId', 'organisationId')
  @ApiOperation({ summary: 'Delete a user from organisation' })
  async removeUser(
    @Param('organisationId') organisationId: string,
    @Param('profileId') profileId: string,
    @Body() userEmail: DeleteUserDto,
  ) {
    const deletedUser = await this.orgService.removeUser(
      organisationId,
      profileId,
      userEmail,
    );
    return ZapiResponse.Ok(
      deletedUser,
      'User deleted from the organisation team',
      '200',
    );
  }

  @Put('/:profileId/update/:organisationId')
  @IdCheck('profileId', 'organisationId')
  @ApiOperation({ summary: 'Update an existing organisation' })
  async updateOrganisation(
    @Body() updateOrganisationDto: UpdateOrganisationDto,
    @Param('organisationId') organisationId: string,
    @Param('profileId') profileId: string,
  ) {
    const updatedOrganisation = await this.orgService.updateOrganisation(
      organisationId,
      profileId,
      updateOrganisationDto,
    );
    return ZapiResponse.Ok(updatedOrganisation, 'Organisation updated', '200');
  }

  @Get('/users-org/:organisationId')
  @IdCheck('organisationId')
  @ApiOperation({ summary: 'Get all Organisation a user belongs to' })
  async getUserOrganisations(@Param('organisationId') organisationId: string) {
    const users = await this.orgService.findUserOrgs(organisationId);
    return ZapiResponse.Ok(users, 'User Organisation', '200');
  }
}
