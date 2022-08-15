import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ZapiResponse } from 'src/common/helpers/response';
import { Api } from '../entities/api.entity';
import { Repository } from 'typeorm';
import { CreateApiDto } from './dto/create-api.dto';
import { UpdateApiDto } from './dto/update-api.dto';
import {
  FilterOperator,
  PaginateQuery,
  paginate,
  Paginated,
} from 'nestjs-paginate';
import { v4 as uuid } from 'uuid';

/* The ApiService class is a service that uses the APiRepository class to do crud operation */
@Injectable()
export class ApiService {
  constructor(
    @InjectRepository(Api)
    private readonly apiRepository: Repository<Api>,
  ) {}

  /* Checking if the api name already exists in the database. */
  async create(profileId: string, createApiDto: CreateApiDto): Promise<Api> {
    try {
      const api = await this.apiRepository.findOne({
        where: { name: createApiDto.name },
      });

      if (api) {
        throw new BadRequestException(
          ZapiResponse.BadRequest(
            'Existing Values',
            'An api with this name already exists, use another name',
          ),
        );
      }

      // Generate a unique UUID string as the api secret key
      const uniqueApiSecurityKey = uuid();

      const newApi = this.apiRepository.create({
        ...createApiDto,
        profileId,
        secretKey: uniqueApiSecurityKey,
      });

      return await this.apiRepository.save(newApi);
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Internal Server error', error.message, '500'),
      );
    }
  }

  /**
   * It takes a query object, and returns a paginated result of the Api model
   * @param {PaginateQuery} query - PaginateQuery - This is the query object that is passed to the
   * service.
   * @returns Paginated<Api>
   */
  async findAll(query: PaginateQuery): Promise<Paginated<Api>> {
    try {
      return paginate(query, this.apiRepository, {
        sortableColumns: ['createdOn', 'name'],
        searchableColumns: ['name', 'description', 'about'],
        defaultSortBy: [['id', 'DESC']],
        filterableColumns: {
          category: [FilterOperator.IN],
          status: [FilterOperator.IN],
          rating: [FilterOperator.GTE, FilterOperator.LTE],
        },
      });
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Internal Server error', error.message, '500'),
      );
    }
  }

  /**
   * It takes in an object with a name and value property, and then uses the name property to find the
   * value property in the database.
   * @param {any}  - name - the name of the field you want to search for - value - value you are searching with
   * @returns An array of Api objects.
   */
  async customFind({ name, value }: any): Promise<Api[]> {
    try {
      return await this.apiRepository.find({
        where: { [`${name}`]: value },
      });
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Internal Server error', error.message, '500'),
      );
    }
  }

  /**
   * It finds an api by id and throws an error if it doesn't exist
   * @param {string} apiId - The id of the api to be found
   * @returns An Api object
   */
  async findOneById(apiId: string): Promise<Api> {
    try {
      const api = await this.apiRepository.findOne({ where: { id: apiId } });
      if (!api) {
        throw new NotFoundException(
          ZapiResponse.NotFoundRequest(
            'Not Found',
            'Api does not exist',
            '404',
          ),
        );
      }
      return api;
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Internal Server error', error.message, '500'),
      );
    }
  }
  /**
   * It checks if the user is the owner of the api, if yes, it updates the api.
   * </code>
   * @param {string} apiId - The id of the api to be updated.
   * @param {string} profileId - The id of the user who is trying to update the api.
   * @param {UpdateApiDto} updateApiDto - UpdateApiDto
   * @returns The update method returns a promise of type UpdateResult.
   */
  async update(
    apiId: string,
    profileId: string,
    updateApiDto: UpdateApiDto,
  ): Promise<Api> {
    try {
      const api = await this.apiRepository.findOne({ where: { id: apiId } });
      if (api) {
        /* Checking if the user is the owner of the api. */
        const verified = await this.verify(apiId, profileId);
        if (verified === false) {
          throw new NotFoundException(
            ZapiResponse.BadRequest('Forbidden', 'Unauthorized action', '403'),
          );
        }

        await this.apiRepository.update(apiId, updateApiDto);
        const updatedApi = await this.apiRepository.findOne({
          where: { id: apiId },
        });
        if (updatedApi) {
          return updatedApi;
        }
      } else {
        ZapiResponse.NotFoundRequest('Not Found', 'Api does not exist', '404');
      }
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Internal Server error', error.message, '500'),
      );
    }
  }

  /**
   * It finds an api by id, if it exists, it removes it, if it doesn't exist, it throws a
   * NotFoundException
   * @param {string} apiId - The id of the api to be deleted
   * @returns The api object that was removed.
   */
  async remove(apiId: string, profileId: string): Promise<Api> {
    try {
      /* Checking if the user is the owner of the api. */
      const verified = await this.verify(apiId, profileId);
      if (verified === false) {
        throw new NotFoundException(
          ZapiResponse.BadRequest('Forbidden', 'Unauthorized action', '403'),
        );
      }
      const api = await this.apiRepository.findOne({ where: { id: apiId } });
      if (api) {
        return await this.apiRepository.remove(api);
      }
      throw new NotFoundException(
        ZapiResponse.NotFoundRequest('Not Found', 'Api does not exist', '404'),
      );
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Internal Server error', error.message, '500'),
      );
    }
  }

  /**
   * It checks if the profileId of the api is the same as the profileId of the user.
   * </code>
   * @param {string} apiId - The id of the api
   * @param {string} profileId - The profileId is the id of the profile that is being verified.
   * @returns A boolean value
   */
  async verify(apiId: string, profileId: string): Promise<boolean> {
    try {
      const api = await this.apiRepository.findOne({ where: { id: apiId } });
      if (!api) {
        throw new NotFoundException(
          ZapiResponse.NotFoundRequest(
            'Not Found',
            'Api does not exist',
            '404',
          ),
        );
      } else {
        const status = api.profileId === profileId ? true : false;
        return status;
      }
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Internal Server error', error.message, '500'),
      );
    }
  }
}
