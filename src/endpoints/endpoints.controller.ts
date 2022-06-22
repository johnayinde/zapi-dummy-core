import { Controller, Post, Body, Param } from '@nestjs/common';
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
}
