import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { EndpointsService } from './endpoints.service';
import { CreateEndpointDto } from './dto/create-endpoint.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Endpoint } from '../entities/endpoint.entity';
import { Ok, ZapiResponse } from 'src/common/helpers/response';

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
  @ApiOperation({ summary: 'get all endpoints' })
  async findAll(): Promise<Ok<Endpoint[]>> {
    const endpoints = await this.endpointsService.find();
    return ZapiResponse.Ok(endpoints, 'Ok', '200');
  }

  /* This is a get request that takes in a parameter and returns a promise of an endpoint. */
  @Get(':id')
  @ApiOperation({ summary: 'get an endpoint by Id' })
  async findOneById(@Param('id') id: string): Promise<Ok<Endpoint>> {
    const endpoint = await this.endpointsService.findOneById(id);
    return ZapiResponse.Ok(endpoint, 'Ok', '200');
  }
}
