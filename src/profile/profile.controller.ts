import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ProfileService } from './profile.service';
import { Profile } from '../entities/profile.entity';
import { IdCheckGuard } from 'src/common/guards/idcheck.guard';


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

    @Get('/:id')
    @UseGuards(IdCheckGuard)
    async getProfile(@Param('id', new ParseUUIDPipe()) id: string){
        const userProfile = await this.profileService.getOne(id)
        return userProfile
    }
}
