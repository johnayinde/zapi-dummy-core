import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Profile } from '../entities/profile.entity';
import { ProfileRepository } from '../database/repository/profile.repository';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ZapiResponse } from '../common/helpers/response';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(Profile)
        private profileRepo: Repository<Profile> 
    ){}

    async create (profileDto: CreateProfileDto): Promise<Profile>{
        try{
            const existingProfile = await this.profileRepo.findOne({where: {email: profileDto.email}})
            if(existingProfile){
                throw new BadRequestException(
                    ZapiResponse.BadRequest('BadRequest' ,'A Profile with that email already exists', '400')
                )
            }
            const profile = await this.profileRepo.create({
                ...profileDto,
            })
            const userProfile = await this.profileRepo.save(profile)
            return userProfile
        } catch(error) {
            throw new BadRequestException(
                ZapiResponse.BadRequest('Internal Server error', error.message, '500')
            )
        }
    }

    async getOne(profileID: string): Promise<Profile>{
        const profile = await this.profileRepo.findOne({where : { id: profileID}})
        if(!profile){
            throw new NotFoundException(
                ZapiResponse.NotFoundRequest('Not Found', 'Profile does not exist', '404')
            )
        } return profile
    }
}
