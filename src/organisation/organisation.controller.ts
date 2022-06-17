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

@ApiTags('Organisation')
@Controller('organisation')
export class OrganisationController {
  constructor(private readonly orgService: OrganisationService) {}

  @ApiOperation({ summary: 'Create an organisations' })
  @Post('/create/:profileId')
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
    const users = await this.orgService.findUsersByOrg(id);
    return ZapiResponse.Ok(users, 'All users of an organisation', '200');
  }

  @Put()
  @ApiOperation({ summary: 'Update an existing organisation' })
  async updateOrganisation() {}

  @Delete()
  @ApiOperation({ summary: 'Delete an existing organisation and its users' })
  async removeOrganisation() {}

  @Delete()
  @ApiOperation({ summary: 'Delete a user in an organisation' })
  async removeUsers() {}
}
