import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrganisationDto } from './dto/create-org.dto';
import { OrganisationService } from './organisation.service';
import { OrgUserDto } from './dto/create-user.dto';
import { ZapiResponse } from 'src/common/helpers/response';
import { ProfileDto } from './dto/profile-dto';

@ApiTags('Organisation')
@Controller('organisation')
export class OrganisationController {
  constructor(private readonly orgService: OrganisationService) {}

  @ApiOperation({ summary: 'Create a profile to test organisation endpoints' })
  @Post('/createProfile')
  async createNewProfile(@Body() profileDto: ProfileDto) {
    const profile = await this.orgService.createProfile(profileDto);
    return ZapiResponse.Ok(profile, 'Created a new Organisation', '201');
  }

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
    return ZapiResponse.Ok(organisation, 'Created a new Organisation', '201');
  }

  @Post('/addUser/:id')
  @ApiOperation({ summary: 'Add user to existing organisation' })
  async addUserToOrg(@Body() orgUserDto: OrgUserDto, @Param('id') id: string) {
    const user = await this.orgService.addUserToOrg(id, orgUserDto);
    return ZapiResponse.Ok(user, 'User added to Organisation', '201');
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get one organisation' })
  async getOrganisationById(@Param('id') id: string) {
    const allOrganisation = await this.orgService.findOrganisationById(id);
    return ZapiResponse.Ok(allOrganisation, 'All Organisation', '200');
  }

  @Get('/users/:id')
  @ApiOperation({ summary: 'Get users of organisation' })
  async getOrgUsers(@Param('id') id: string) {
    const users = await this.orgService.findUsersByOrg(id);
    return ZapiResponse.Ok(users, 'All users of an organisation', '200');
  }
}
