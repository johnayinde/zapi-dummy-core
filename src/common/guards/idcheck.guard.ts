import {
  BadRequestException,
  CanActivate,
  ExecutionContext
} from '@nestjs/common';
import { ZapiResponse } from '../helpers/response';
const validate = require ('uuid-validate');


export class IdCheckGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const {params} = request
    Object.values(params).forEach(id => {if(!validate(id)){
      throw new BadRequestException( ZapiResponse.BadRequest( 'bad request', 'invalid id', '400'));
    }})
    return true;
  }
}