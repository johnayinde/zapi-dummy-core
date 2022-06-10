import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiService } from './api.service';
import { CreateApiDto } from './dto/create-api.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ZapiResponse } from 'src/common/helpers/response/Response';
import { Ok } from 'src/common/helpers/response/ResponseType';
import { Api } from '../entities/api.entity';
import { CustomFindDto } from './dto/customFind.dto';

@ApiTags('Apis')
@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  /* This is a post request that takes in a body and returns a promise of an Api */
  @Post('new/:profileId')
  @ApiOperation({ summary: 'Add a new api' })
  async create(
    @Param('profileId') profileId: string,
    @Query('categoryId') categoryId: string,
    @Body() createApiDto: CreateApiDto,
  ): Promise<Ok<Api>> {
    const api = await this.apiService.create(
      profileId,
      categoryId,
      createApiDto,
    );
    return ZapiResponse.Ok(api, 'Api Created', '201');
  }

  /* This is a get request that returns all the apis. */
  @Get()
  @ApiOperation({ summary: 'Get all apis' })
  async findAll() {
    const apis = await this.apiService.findAll();
    return ZapiResponse.Ok(apis, 'Ok', '200');
  }

  /* This is a get request that takes in an id and returns the api that matches the Id */
  @Get(':id')
  @ApiOperation({ summary: 'Get a single api by api id' })
  async findOne(@Param('id') id: string) {
    const api = await this.apiService.findOneById(id);
    return ZapiResponse.Ok(api, 'Ok', '200');
  }
  /* This is a post request that takes in a body and returns a promise of an Api. */
  @Post('custom_find')
  @ApiOperation({ summary: 'Get apis by query' })
  async customFind(@Body() customFindDto: CustomFindDto) {
    const api = await this.apiService.customFind(customFindDto);
    return ZapiResponse.Ok(api, 'Ok', '200');
  }

  /* This is a delete request that takes in an id and profileId and returns a promise of an Api. */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an API' })
  async remove(@Param('id') id: string, @Query('profileId') profileId: string) {
    const api = await this.apiService.remove(id, profileId);
    return ZapiResponse.Ok(api, 'Ok', '200');
  }
}
