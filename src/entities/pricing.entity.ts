import { Entity, Column, PrimaryGeneratedColumn, OneToOne, } from "typeorm";
import { SharedEntity } from "../common/model/sharedEntity";
import { ApiPricing } from "./api-pricing.entity";

@Entity()
export class Pricing extends SharedEntity {

    @Column()
    subscriptionPlan: string;

    @Column()
    pricePerTime: string;

    @Column()
    requests: string;
    
    @OneToOne(type => ApiPricing, {nullable: true}) 
    apiPricing: ApiPricing;
}