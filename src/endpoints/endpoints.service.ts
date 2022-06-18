import { BadRequestException, Injectable } from '@nestjs/common';
import { ZapiResponse } from 'src/common/helpers/response';
import { APIRepository } from 'src/database/repository/api.repository';
import { EndpointRepository } from 'src/database/repository/endpoints.repository';
import { Endpoint } from 'src/entities/endpoint.entity';
import { CreateEndpointDto } from './dto/create-endpoint.dto';

@Injectable()
export class EndpointsService {
  constructor(
    private readonly endpointRepository: EndpointRepository,
    private readonly apiRepository: APIRepository,
  ) {}

  /**
   * It creates an endpoint and saves it to the database
   * @param {string} apiId - string,
   * @param {CreateEndpointDto} createEndpointDto - CreateEndpointDto
   * @returns The endpoint is being returned.
   */
  async create(
    apiId: string,
    createEndpointDto: CreateEndpointDto,
  ): Promise<Endpoint> {
    try {
      const endpoint = await this.endpointRepository.findOne({
        where: { name: createEndpointDto.name },
      });

      if (endpoint) {
        throw new BadRequestException(
          ZapiResponse.BadRequest(
            'Existing Endpoint',
            'An endpoint with this name already exists, use another name',
          ),
        );
      }
      const newEndpoint = this.endpointRepository.create({
        ...createEndpointDto,
        apiId,
      });

      const savedEndpoint = await this.endpointRepository.save(newEndpoint);
      await this.apiRepository.update(apiId, {
        endpointsId: savedEndpoint.id,
      });

      return savedEndpoint;
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Server error', '500 Internal Server Error'),
      );
    }
  }
}
