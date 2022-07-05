import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ZapiResponse } from "src/common/helpers/response";
import { Api } from "src/entities/api.entity";
import { Tutorial } from "src/entities/tutorial.entity";
import { Repository } from "typeorm";
import { TutorialDto } from "./dto/create-tutorial-dto";
import { UpdateTutorialDto } from "./dto/update-tutorial.dto";

@Injectable()
export class TutorialService{
    constructor(
        @InjectRepository(Tutorial)
        private readonly tutorialRepo : Repository<Tutorial>,
        @InjectRepository(Api)
        private readonly apiRepo : Repository<Api>
    ){}

    /**
     * Assigns a tutorial to an api
     * returns the tutorial title if successful
     * returns an error if unsuccessful
     */
    async createTutorial(tutorialDto: TutorialDto) : Promise<Tutorial>{
        //check if api exists
        const apiExists = await this.apiRepo.findOneBy({id: tutorialDto.apiId})
        // return error if api does not exists
        if(!apiExists){
            throw new BadRequestException(
                ZapiResponse.NotFoundRequest(`Api with id : ${tutorialDto.apiId} does not exists`)
            )
        }
        
        try{
            // save tutorial to database
            const tutorial = await this.tutorialRepo.save(tutorialDto)
            return tutorial
        }catch(err){
            throw new BadRequestException(
                ZapiResponse.BadRequest("Error creating tutorial", "500", err.message)
                )
            }
        }

    /**
     * delete tutorial assigned to an api
     */
    async deleteTutorial(tutorialId: string) : Promise<Object>{
        // check if tutorial exists
        const tutorialExists = await this.tutorialRepo.findOneBy({id:tutorialId})
        //return error if tustorial does not exist
        if(!tutorialExists){
            throw new BadRequestException(
                ZapiResponse.NotFoundRequest("Tutorial does not exists")
            )
        }
        //delete tutorial if it exists
        try{
            await this.tutorialRepo.delete({id: tutorialId})
            return {message: "Tutorial deleted"}
        }catch(err){
            ZapiResponse.OkFailure("Error deleting tutorial", "500", err.message)
        }
    }

    /**
     * get single tutorial by id
     */
    async getSingleTutorial(tutorialId: string) : Promise<Tutorial>{
        // find tutorial 
        const tutorial = await this.tutorialRepo.findOneBy({id: tutorialId})
        // throw error if tutorial not found
        if(!tutorial){
            throw new BadRequestException(
                ZapiResponse.NotFoundRequest("Tutorial not found")
            )
        }
        return tutorial
    }

    async updateTutorial(
        apiId: string, 
        tutorialId: string, 
        updateTutorialDto: UpdateTutorialDto) : Promise<Tutorial>{
        //check if api exists
        const apiExists = await this.apiRepo.findOneBy({id: apiId})
        //check if tutorial exists
        const tutorialExists = await this.tutorialRepo.findOneBy({id: tutorialId})
        // return error if api or tutorial does not exists
        if(!apiExists || !tutorialExists){
            throw new BadRequestException(
                ZapiResponse.NotFoundRequest(`Api with id : ${apiId} or Tutorial with id : ${tutorialId} does not exists`)
            )
        } 
        //update tutorial
        const updatedTutorial = await this.tutorialRepo.update(tutorialId, updateTutorialDto)

        if(!updatedTutorial){
            throw new BadRequestException(
                ZapiResponse.NotFoundRequest("Tutorial not updated", "500")
            )
        }

        return tutorialExists
        
    }
}