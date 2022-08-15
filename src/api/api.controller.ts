import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Patch,
} from '@nestjs/common';
import { ApiService } from './api.service';
import { CreateApiDto } from './dto/create-api.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ZapiResponse } from 'src/common/helpers/response/Response';
import { Ok } from 'src/common/helpers/response/ResponseType';
import { Api } from '../entities/api.entity';
import { CustomFindDto } from './dto/customFind.dto';
import { UpdateApiDto } from './dto/update-api.dto';
import { Paginate, PaginateQuery, Paginated } from 'nestjs-paginate';
import { IdCheck } from 'src/common/decorators/idcheck.decorator';

@ApiTags('Apis')
@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  /* This is a post request that takes in a body and returns a promise of an Api */
  @Post('new/:profileId')
  @IdCheck('profileId')
  @ApiOperation({ summary: 'Add a new api' })
  async create(
    @Param('profileId') profileId: string,
    @Body() createApiDto: CreateApiDto,
  ): Promise<Ok<Api>> {
    const api = await this.apiService.create(profileId, createApiDto);
    return ZapiResponse.Ok(api, 'Api Created', '201');
  }

  /* This is a get request that takes in a query and returns a promise of a paginated Api. */
  @Get()
  @ApiOperation({ summary: 'Get or search all apis' })
  async findAll(@Paginate() query: PaginateQuery): Promise<Paginated<Api>> {
    return await this.apiService.findAll(query);
  }

  /* This is a get request that takes in an id and returns the api that matches the Id */
  @Get(':apiId')
  @IdCheck('apiId')
  @ApiOperation({ summary: 'Get a single api by api id' })
  async findOne(@Param('apiId') apiId: string) {
    const api = await this.apiService.findOneById(apiId);
    return ZapiResponse.Ok(api, 'Ok', '200');
  }
  /* This is a post request that takes in a body and returns a promise of an Api. */
  @Post('custom_find')
  @ApiOperation({ summary: 'Get apis by query' })
  async customFind(@Body() customFindDto: CustomFindDto) {
    const api = await this.apiService.customFind(customFindDto);
    return ZapiResponse.Ok(api, 'Ok', '200');
  }

  /* A put request that takes in an apiId, profileId, and a body and returns a promise of an
  UpdateResult. */
  @Patch(':apiId')
  @IdCheck('apiId')
  @ApiOperation({ summary: 'Update api' })
  async update(
    @Param('apiId') apiId: string,
    @Query('profileId') profileId: string,
    @Body() updateApiDto: UpdateApiDto,
  ): Promise<Ok<Api>> {
    const api = await this.apiService.update(apiId, profileId, updateApiDto);
    return ZapiResponse.Ok(api, 'Api Updated', '200');
  }

  /* This is a delete request that takes in an id and profileId and returns a promise of an Api. */
  @Delete(':apiId')
  @IdCheck('apiId')
  @ApiOperation({ summary: 'Delete an API' })
  async remove(@Param('apiId') apiId: string, @Query('profileId') profileId: string) {
    const api = await this.apiService.remove(apiId, profileId);
    return ZapiResponse.Ok(api, 'Ok', '200');
  }
}
