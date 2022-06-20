import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { EndpointsService } from './endpoints.service';
import { CreateEndpointDto } from './dto/create-endpoint.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Endpoint } from 'src/entities/endpoint.entity';
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
  /* This is a get request that takes in no params and returns a promise of endpoints. */
  @Get('/all')
  @ApiOperation({ summary: 'Get all endpoints' })
  async findAll() {
    const endpoints = await this.endpointsService.findAll();
    return ZapiResponse.Ok(endpoints, 'Ok', '200');
  }

  /* This is a get request that takes in a param-apiId and returns a promise of endpoints. */
  @Get('/api-endpoints/:apiId')
  @ApiOperation({ summary: 'Get all api endpoints ' })
  async findAllByApiId(@Param('apiId') apiId: string) {
    const endpoints = await this.endpointsService.findByApiId(apiId);
    return ZapiResponse.Ok(endpoints, 'Ok', '200');
  }

  /* This is a get request that takes in a param-id and returns a promise of an endpoint. */
  @Get(':id')
  @ApiOperation({ summary: 'Get a single endpoint by id ' })
  async findOneById(@Param('id') id: string) {
    const endpoint = await this.endpointsService.findOneById(id);
    return ZapiResponse.Ok(endpoint, 'Ok', '200');
  }
}
