import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Put,
  Query,
} from '@nestjs/common';
import { ApiService } from './api.service';
import { CreateApiDto } from './dto/create-api.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateApiDto } from './dto/update-api.dto';
import { ZapiResponse } from 'src/common/helpers/response/Response';
import { Ok } from 'src/common/helpers/response/ResponseType';
import { Api } from '../entities/api.entity';
import { CustomFindDto } from './dto/customFind.dto';

@ApiTags('Apis')
@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  /* This is a post request that takes in a body and returns a promise of an Api */
  @Post('new/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a new API' })
  async create(
    @Param('id') id: string,
    @Body() createApiDto: CreateApiDto,
  ): Promise<Ok<Api>> {
    const api = await this.apiService.create(id, createApiDto);
    return ZapiResponse.Ok(api, 'Api Created', '201');
  }

  /* This is a get request that returns all the apis. */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all apis' })
  async findAll() {
    return await this.apiService.findAll();
  }

  /* This is a get request that takes in an id and returns the api that matches the Id */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a single api by api id' })
  async findOne(@Param('id') id: string) {
    return await this.apiService.findOneById(id);
  }

  /* This is a post request that takes in query name and value and returns a promise of an Api */
  @Post('custom_find')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get apis by query' })
  async customFind(@Body() customFindDto: CustomFindDto) {
    return await this.apiService.customFind(customFindDto);
  }

  /* This is a put request that takes in an id and payload, then returns the updated api */
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an api' })
  async update(
    @Body() updateApiDto: UpdateApiDto,
    @Param('id') id: string,
    @Query('user_id') user_id: string,
  ): Promise<Ok<Api>> {
    const api = await this.apiService.update(id, user_id, updateApiDto);
    return ZapiResponse.Ok(api, 'Api Updated', '200');
  }

  /* A delete request that takes in an id and returns the apiService.remove(+id) */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete an API' })
  async remove(@Param('id') id: string, @Query('user_id') user_id: string) {
    return await this.apiService.remove(id, user_id);
  }
}
