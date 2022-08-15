import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Api } from 'src/entities/api.entity';
import { Category } from 'src/entities/category.entity';
import { Endpoint } from 'src/entities/endpoint.entity';
import { Organisation } from 'src/entities/organisation.entity';
import { Pricing } from 'src/entities/pricing.entity';
import { Profile } from 'src/entities/profile.entity';
import { Subscription } from 'src/entities/subscription.entity';
import { Repository } from 'typeorm';
import { ZapiResponse } from '../helpers/response';

// const service = {
//   'id': ProfileService
// }

@Injectable()
export class IdCheckGuard implements CanActivate {
  constructor(
    @InjectRepository(Profile)
    private profileRepo: Repository<Profile>,
    @InjectRepository(Api)
    private apiRepo: Repository<Api>,
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
    @InjectRepository(Endpoint)
    private endpointRepo: Repository<Endpoint>,
    @InjectRepository(Organisation)
    private orgRepo: Repository<Organisation>,
    @InjectRepository(Pricing)
    private pricingRepo: Repository<Pricing>,
    @InjectRepository(Subscription)
    private readonly subRepo: Repository<Subscription>,
    private reflector: Reflector
  ){}

//  save repository in corresponding id keys into an object
  repo = {
    'profileId': this.profileRepo,
    'apiId': this.apiRepo,
    'categoryId': this.categoryRepo,
    'endpointId': this.endpointRepo,
    'organisationId': this.orgRepo,
    'pricingId': this.pricingRepo,
    'subscriptionId': this.subRepo
  }

  async canActivate(context: ExecutionContext) {
    const requiredId = this.reflector.get<string[]>('id', context.getHandler());
    console.log(requiredId);
    const request = context.switchToHttp().getRequest();
    for(let index in requiredId){
      const idValue = request.params[`${requiredId[index]}`];
        if(!idValue){
          throw new BadRequestException( ZapiResponse.BadRequest( 'bad request', `${requiredId[index]} is not provided as params`, '400'));
        }
      console.log(idValue);
      const objDetail = await this.repo[`${requiredId[index]}`].findOne({where: {id: idValue}});
      console.log(objDetail);
        if(!objDetail){
          throw new NotFoundException( ZapiResponse.NotFoundRequest( 'Not Found', `${requiredId[index]} does not exist`, '404'));
        }
    }
    return true;
  }
}