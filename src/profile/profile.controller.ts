import { Body, Controller, Get, Param, ParseUUIDPipe, Post} from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ProfileService } from './profile.service';
import { Profile } from '../entities/profile.entity';
import { IdCheck } from 'src/common/decorators/idcheck.decorator';


@Controller('profile')
export class ProfileController {
    constructor(
        private profileService: ProfileService
    ){}

    @Post('/create')
    async CreateProfile(@Body() body: CreateProfileDto): Promise<Profile>
    {
        const userProfile = await this.profileService.create(body)
        return userProfile
    }

    @Get('/:profileId')
    @IdCheck('profileId')
    async getProfile(@Param('profileId', new ParseUUIDPipe()) profileId: string){
        const userProfile = await this.profileService.getOne(profileId)
        return userProfile
    }
}
