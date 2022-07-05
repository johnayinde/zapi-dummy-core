import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ZapiResponse } from 'src/common/helpers/response';
import { Endpoint } from '../entities/endpoint.entity';
import { Repository } from 'typeorm';
import { CreateEndpointDto } from './dto/create-endpoint.dto';

@Injectable()
export class EndpointsService {
  constructor(
    @InjectRepository(Endpoint)
    private readonly endpointRepository: Repository<Endpoint>,
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
        ZapiResponse.BadRequest('Internal Server error', error.message, '500'),
      );
    }
  }

  /**
   * It returns an array of Endpoint objects from the database
   * @returns An array of Endpoint objects.
   */
  async find(): Promise<Endpoint[]> {
    try {
      return await this.endpointRepository.find();
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Internal Server error', error.message, '500'),
      );
    }
  }

  /**
   * Find one endpoint by id
   * @param {string} id - string - the id of the endpoint you want to find
   * @returns The endpoint with the id that was passed in.
   */
  async findOneById(id: string): Promise<Endpoint> {
    try {
      return await this.endpointRepository.findOne({ where: { id } });
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Internal Server error', error.message, '500'),
      );
    }
  }
}
