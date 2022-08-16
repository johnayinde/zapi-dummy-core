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
        where: {
          apiId,
          method: createEndpointDto.method,
          route: createEndpointDto.route
        }
      });

      if (endpoint) {
        throw new BadRequestException(
          ZapiResponse.BadRequest(
            'Existing Endpoint',
            'An endpoint with duplicate method already exists, use another method',
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
   * Find one endpoint by endpointId
   * @param {string} endpointId - string - the endpointId of the endpoint you want to find
   * @returns The endpoint with the endpointId that was passed in.
   */
  async findOneById(endpointId: string): Promise<Endpoint> {
    try {
      return await this.endpointRepository.findOne({ where: { id: endpointId } });
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
   * @param {string} endpointId - The endpointId of the endpoint to be updated.
   * @param {UpdateEndpointDto} updateEndpointDto - UpdateEndpointDto
   * @returns The update method returns a promise if updated Endpoint.
   */

  async update(
    endpointId: string,
    updateEndpointDto: UpdateEndpointDto,
  ): Promise<Endpoint> {
    try {
      const endpoint = await this.endpointRepository.findOne({
        where: { id: endpointId },
      });
      if (endpoint) {
        await this.endpointRepository.update(endpointId, updateEndpointDto);
        const updatedEndpoint = await this.endpointRepository.findOne({
          where: { id: endpointId },
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
   * It finds an endpoint by endpointId, if it exists, it removes it, if it doesn't exist, it throws a
   * NotFoundException
   * @param {string} endpointId - The endpointId of the endpoint to be deleted
   * @returns The endpoint object that was removed.
   */
  async remove(endpointId: string): Promise<Endpoint> {
    try {
      const endpoint = await this.endpointRepository.findOne({ where: { id: endpointId } });
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
