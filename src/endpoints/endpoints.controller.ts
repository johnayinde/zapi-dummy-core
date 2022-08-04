import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Patch,
  Delete
} from '@nestjs/common';
import { EndpointsService } from './endpoints.service';
import { CreateEndpointDto } from './dto/create-endpoint.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Endpoint } from '../entities/endpoint.entity';
import { Ok, ZapiResponse } from 'src/common/helpers/response';
import { UpdateEndpointDto } from './dto/update-endpoint.dto';

@ApiTags('Endpoints')
@Controller('endpoints')
export class EndpointsController {
  constructor(private readonly endpointsService: EndpointsService) {}

  /* This is a post request that takes in a body and returns a promise of an Api */
  @Post('new/:apiId')
  @ApiOperation({ summary: 'Add a new endpoint' })
  async create(
    @Param('apiId') apiId: string,
    @Body() createEndpointDto: CreateEndpointDto,
  ): Promise<Ok<Endpoint>> {
    const endpoint = await this.endpointsService.create(
      apiId,
      createEndpointDto,
    );
    return ZapiResponse.Ok(endpoint, 'Endpoint Created', '201');
  }

  /* This is a get request that takes in a parameter and returns a promise of an endpoint. */
  @Get()
  @ApiOperation({ summary: 'Get all endpoints' })
  async findAll(): Promise<Ok<Endpoint[]>> {
    const endpoints = await this.endpointsService.find();
    return ZapiResponse.Ok(endpoints, 'Ok', '200');
  }

  /* This is a get request that takes in a parameter and returns a promise of an endpoint. */
  @Get(':id')
  @ApiOperation({ summary: 'Get an endpoint by Id' })
  async findOneById(@Param('id') id: string): Promise<Ok<Endpoint>> {
    const endpoint = await this.endpointsService.findOneById(id);
    return ZapiResponse.Ok(endpoint, 'Ok', '200');
  }

  /* This is a get request that takes in a parameter and returns a promise of an endpoint. */
  @Get('/single-api/:apiId')
  @ApiOperation({ summary: 'Get all endpoints for an api' })
  async findAllByApiId(@Param('apiId') apiId: string): Promise<Ok<Endpoint[]>> {
    const endpoint = await this.endpointsService.getAllApiEndpoints(apiId);
    return ZapiResponse.Ok(endpoint, 'Ok', '200');
  }

  /* This is an update request that takes in an id and update Payload and returns a promise of updated endpoint. */
  @Patch(':id')
  @ApiOperation({ summary: 'Update an endpoint' })
  async update(
    @Body() updateEndpointDto: UpdateEndpointDto,
    @Param('id') id: string,
  ): Promise<Ok<Endpoint>> {
    const endpoint = await this.endpointsService.update(id, updateEndpointDto);
    return ZapiResponse.Ok(endpoint, 'Ok', '200');
  }

  /* This is a delete request that takes in an id and returns a promise of the deleted endpoint. */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an endpoint' })
  async remove(@Param('id') id: string) {
    const endpoint = await this.endpointsService.remove(id);
    return ZapiResponse.Ok(endpoint, 'Ok', '200');
  }
}
