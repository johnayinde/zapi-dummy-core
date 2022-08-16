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
import { IdCheck } from 'src/common/decorators/idcheck.decorator';

@ApiTags('Endpoints')
@Controller('endpoints')
export class EndpointsController {
  constructor(private readonly endpointsService: EndpointsService) {}

  /* This is a post request that takes in a body and returns a promise of an Api */
  @Post('new/:apiId')
  @IdCheck('apiId')
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
  @Get(':endpointId')
  @IdCheck('endpointId')
  @ApiOperation({ summary: 'Get an endpoint by endpointId' })
  async findOneById(@Param('endpointId') endpointId: string): Promise<Ok<Endpoint>> {
    const endpoint = await this.endpointsService.findOneById(endpointId);
    return ZapiResponse.Ok(endpoint, 'Ok', '200');
  }

  /* This is a get request that takes in a parameter and returns a promise of an endpoint. */
  @Get('/single-api/:apiId')
  @IdCheck('apiId')
  @ApiOperation({ summary: 'Get all endpoints for an api' })
  async findAllByApiId(@Param('apiId') apiId: string): Promise<Ok<Endpoint[]>> {
    const endpoint = await this.endpointsService.getAllApiEndpoints(apiId);
    return ZapiResponse.Ok(endpoint, 'Ok', '200');
  }

  /* This is an update request that takes in an id and update Payload and returns a promise of updated endpoint. */
  @Patch(':endpointId')
  @ApiOperation({ summary: 'Update an endpoint' })
  async update(
    @Body() updateEndpointDto: UpdateEndpointDto,
    @Param('endpointId') endpointId: string,
  ): Promise<Ok<Endpoint>> {
    const endpoint = await this.endpointsService.update(endpointId, updateEndpointDto);
    return ZapiResponse.Ok(endpoint, 'Ok', '200');
  }

  /* This is a delete request that takes in an id and returns a promise of the deleted endpoint. */
  @Delete(':endpointId')
  @ApiOperation({ summary: 'Delete an endpoint' })
  async remove(@Param('endpointId') endpointId: string) {
    const endpoint = await this.endpointsService.remove(endpointId);
    return ZapiResponse.Ok(endpoint, 'Ok', '200');
  }
}
