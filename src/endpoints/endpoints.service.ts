import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
      return savedEndpoint;
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Server error', '500 Internal Server Error'),
      );
    }
  }

  /**
   * It returns an array of Endpoint objects.
   * @returns An array of Endpoint objects.
   */
  async findAll(): Promise<Endpoint[]> {
    try {
      return await this.endpointRepository.find();
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Server error', '500'),
      );
    }
  }

  /* Finding all endpoints that have the same apiId as the one passed in. */
  async findByApiId(apiId: string): Promise<Endpoint[]> {
    try {
      const endpoints = await this.endpointRepository.find({
        where: { apiId },
      });
      if (!endpoints) {
        throw new NotFoundException(
          ZapiResponse.NotFoundRequest(
            'Not Found',
            'No endpoints found',
            '404',
          ),
        );
      }
      return endpoints;
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Internal Server Error', '500'),
      );
    }
  }

  /**
   * It finds an endpoint by id and returns it
   * @param {string} id - string - the id of the endpoint you want to find
   * @returns The endpoint object
   */
  async findOneById(id: string): Promise<Endpoint> {
    try {
      const endpoint = await this.endpointRepository.findOne({
        where: { id },
      });
      if (!endpoint) {
        throw new NotFoundException(
          ZapiResponse.NotFoundRequest(
            'Not Found',
            'Endpoint does not exist',
            '404',
          ),
        );
      }
      return endpoint;
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Internal Server Error', '500'),
      );
    }
  }
}
