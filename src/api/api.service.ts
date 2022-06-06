import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ZapiResponse } from 'src/common/helpers/response';
import { APIRepository } from 'src/database/repository/api.repository';
import { CategoryRepository } from 'src/database/repository/category.repository';
import { Api } from 'src/entities/api.entity';
import { CreateApiDto } from './dto/create-api.dto';
import { UpdateApiDto } from './dto/update-api.dto';

/* The ApiService class is a service that uses the APiRepository class to do crud operation */
@Injectable()
export class ApiService {
  constructor(
    private readonly apiRepository: APIRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  /* Checking if the api name already exists in the database. */
  async create(id: string, createApiDto: CreateApiDto): Promise<Api> {
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
      const category = await this.categoryRepository.findOne({
        where: { name: createApiDto.category },
      });
      if (!category) {
        throw new BadRequestException(
          ZapiResponse.NotFoundRequest(
            'Not Found',
            "Category doesn't exist ",
            '404',
          ),
        );
      } else {
        const newApi = this.apiRepository.create({
          ...createApiDto,
          categoryId: category.id,
          profileId: id,
        });

        return await this.apiRepository.save(newApi);
      }
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Server error', error, '500'),
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
        ZapiResponse.BadRequest('Server error', error, '500'),
      );
    }
  }

  /**
   * It takes in a name and value and returns an array of Api objects
   * @param {any}  - name - the name of the query
   * @returns An array of Api objects
   */

  async customFind({ name, value }: any): Promise<Api[]> {
    try {
      let api: any;
      switch (name) {
        case 'verified':
          api = await this.apiRepository.find({
            where: { verified: value },
          });
          break;

        case 'profileId':
          api = await this.apiRepository.find({
            where: { profileId: value },
          });
          break;

        case 'type':
          api = await this.apiRepository.find({ where: { type: value } });
          break;

        case 'category':
          const category = await this.categoryRepository.findOne({
            where: { name: value },
          });

          api = await this.apiRepository.find({
            where: { categoryId: category.id },
          });
          break;
      }
      if (!api) {
        throw new NotFoundException(
          ZapiResponse.NotFoundRequest(
            'Not Found',
            "Can't find any api with queries",
            '404',
          ),
        );
      }
      return api;
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Server error', error, '500'),
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
        ZapiResponse.BadRequest('Server error', error, '500'),
      );
    }
  }

  /**
   * It updates the api with the id passed in the url and returns the updated api
   * @param {string} id - The id of the api to be updated
   * @param {UpdateApiDto} updateApiDto - UpdateApiDto
   * @returns The updated api
   */
  async update(
    id: string,
    user_id: string,
    updateApiDto: UpdateApiDto,
  ): Promise<Api> {
    try {
      /* Checking if the user is the owner of the api. */
      const verified = await this.verify(id, user_id);
      if (verified === false) {
        throw new NotFoundException(
          ZapiResponse.BadRequest('Forbidden', 'Unauthorized action', '403'),
        );
      }
      if (updateApiDto.category) {
        const category = await this.categoryRepository.findOne({
          where: { name: updateApiDto.category },
        });
        if (!category) {
          throw new NotFoundException(
            ZapiResponse.NotFoundRequest(
              'Not Found',
              'Selected category does not exist',
              '404',
            ),
          );
        } else {
          await this.apiRepository.update(id, {
            ...updateApiDto,
            categoryId: category.id,
          });
        }
      } else {
        await this.apiRepository.update(id, updateApiDto);
      }
      const updatedAPI = await this.apiRepository.findOne(id);
      if (updatedAPI) {
        return updatedAPI;
      }
      throw new NotFoundException(
        ZapiResponse.NotFoundRequest('Not Found', 'Api does not exist'),
      );
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Server error', error, '500'),
      );
    }
  }

  /**
   * It finds an api by id, if it exists, it removes it, if it doesn't exist, it throws a
   * NotFoundException
   * @param {number} id - number - The id of the api to be deleted
   * @returns The api object that was removed.
   */
  async remove(id: string, user_id: string): Promise<Api> {
    try {
      /* Checking if the user is the owner of the api. */
      const verified = await this.verify(id, user_id);
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
        ZapiResponse.BadRequest('Server error', error, '500'),
      );
    }
  }

  /**
   * It checks if the api_id and user_id are the same.
   * </code>
   * @param {string} api_id - The id of the api
   * @param {string} user_id - The user id of the user who is trying to access the API
   * @returns The status of the api.
   */
  async verify(api_id: string, user_id: string): Promise<boolean> {
    try {
      const api = await this.apiRepository.findOne({
        id: api_id,
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
        const status = api.profileId === user_id ? true : false;
        return status;
      }
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Server error', error, '500'),
      );
    }
  }
}
