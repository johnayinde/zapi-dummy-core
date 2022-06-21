import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ZapiResponse } from 'src/common/helpers/response';
import { APIRepository } from 'src/database/repository/api.repository';
import { Api } from 'src/entities/api.entity';
import { CreateApiDto } from './dto/create-api.dto';
import { UpdateApiDto } from './dto/update-api.dto';

/* The ApiService class is a service that uses the APiRepository class to do crud operation */
@Injectable()
export class ApiService {
  constructor(private readonly apiRepository: APIRepository) {}

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

      const newApi = this.apiRepository.create({
        ...createApiDto,
        profileId,
      });

      return await this.apiRepository.save(newApi);
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest(
          'Internal Server error',
          error instanceof Error
            ? `${error.message}`
            : 'An unknown error occured',
          '500',
        ),
      );
    }
  }

  /**
   * Find all the apis in the database and return them as an array of Api objects.
   * @returns An array of Api objects.
   */
  async findAll(): Promise<Api[]> {
    try {
      return await this.apiRepository.find();
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest(
          'Server error',
          error instanceof Error
            ? `${error.message}`
            : 'An unknown error occured',
          '500',
        ),
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
        ZapiResponse.BadRequest(
          'Internal Server error',
          error instanceof Error
            ? `${error.message}`
            : 'An unknown error occured',
          '500',
        ),
      );
    }
  }

  /**
   * It finds an api by id and throws an error if it doesn't exist
   * @param {string} id - The id of the api to be found
   * @returns An Api object
   */
  async findOneById(id: string): Promise<Api> {
    try {
      const api = await this.apiRepository.findOne({ where: { id } });
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
        ZapiResponse.BadRequest(
          'Internal Server error',
          error instanceof Error
            ? `${error.message}`
            : 'An unknown error occured',
          '500',
        ),
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
      const api = await this.apiRepository.findOne(apiId);
      if (api) {
        /* Checking if the user is the owner of the api. */
        const verified = await this.verify(apiId, profileId);
        if (verified === false) {
          throw new NotFoundException(
            ZapiResponse.BadRequest('Forbidden', 'Unauthorized action', '403'),
          );
        }

        await this.apiRepository.update(apiId, updateApiDto);
        const updatedApi = await this.apiRepository.findOne(apiId);
        if (updatedApi) {
          return updatedApi;
        }
      } else {
        ZapiResponse.NotFoundRequest('Not Found', 'Api does not exist', '404');
      }
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest(
          'Internal Server error',
          error instanceof Error
            ? `${error.message}`
            : 'An unknown error occured',
          '500',
        ),
      );
    }
  }

  /**
   * It finds an api by id, if it exists, it removes it, if it doesn't exist, it throws a
   * NotFoundException
   * @param {string} id - The id of the api to be deleted
   * @returns The api object that was removed.
   */
  async remove(id: string, profileId: string): Promise<Api> {
    try {
      /* Checking if the user is the owner of the api. */
      const verified = await this.verify(id, profileId);
      if (verified === false) {
        throw new NotFoundException(
          ZapiResponse.BadRequest('Forbidden', 'Unauthorized action', '403'),
        );
      }
      const api = await this.apiRepository.findOne(id);
      if (api) {
        return await this.apiRepository.remove(api);
      }
      throw new NotFoundException(
        ZapiResponse.NotFoundRequest('Not Found', 'Api does not exist', '404'),
      );
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest(
          'Internal Server error',
          error instanceof Error
            ? `${error.message}`
            : 'An unknown error occured',
          '500',
        ),
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
      const api = await this.apiRepository.findOne({
        id: apiId,
      });
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
        ZapiResponse.BadRequest(
          'Internal Server error',
          error instanceof Error
            ? `${error.message}`
            : 'An unknown error occured',
          '500',
        ),
      );
    }
  }
}
