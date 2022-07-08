import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ZapiResponse } from 'src/common/helpers/response';
import { Endpoint } from '../entities/endpoint.entity';
import { Repository } from 'typeorm';
import { CreateEndpointDto } from './dto/create-endpoint.dto';
import { UpdateEndpointDto } from './dto/update-endpoint.dto';
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

  async getAllApiEndpoints(apiId: string): Promise<Endpoint[]> {
    try {
      return await this.endpointRepository.find({ where: { apiId: apiId } });
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Internal Server error', error.message, '500'),
      );
    }
  }

  /**
   * It checks if the endpoint exists, if true, it updates the api.
   * @param {string} id - The id of the endpoint to be updated.
   * @param {UpdateEndpointDto} updateEndpointDto - UpdateEndpointDto
   * @returns The update method returns a promise if updated Endpoint.
   */

  async update(
    id: string,
    updateEndpointDto: UpdateEndpointDto,
  ): Promise<Endpoint> {
    try {
      const endpoint = await this.endpointRepository.findOne({
        where: { id },
      });
      if (endpoint) {
        await this.endpointRepository.update(id, updateEndpointDto);
        const updatedEndpoint = await this.endpointRepository.findOne({
          where: { id },
        });
        if (updatedEndpoint) {
          return updatedEndpoint;
        }
      } else {
        throw new BadRequestException(
          ZapiResponse.NotFoundRequest(
            'Not Found',
            'Endpoint does not exist',
            '404',
          ),
        );
      }
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Internal Server error', error.message, '500'),
      );
    }
  }

  /**
   * It finds an endpoint by id, if it exists, it removes it, if it doesn't exist, it throws a
   * NotFoundException
   * @param {string} id - The id of the endpoint to be deleted
   * @returns The endpoint object that was removed.
   */
  async remove(id: string): Promise<Endpoint> {
    try {
      const endpoint = await this.endpointRepository.findOne({ where: { id } });
      if (endpoint) {
        return await this.endpointRepository.remove(endpoint);
      } else {
        throw new NotFoundException(
          ZapiResponse.NotFoundRequest(
            'Not Found',
            'Endpoint does not exist',
            '404',
          ),
        );
      }
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Internal Server error', error.message, '500'),
      );
    }
  }
}
