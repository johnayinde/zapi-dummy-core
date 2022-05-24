import { SharedEntity } from "src/common/model/sharedEntity";
import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { Api } from "./api.entity";
import { Pricing } from "./pricing.entity";

@Entity()
export class ApiPricing extends SharedEntity {

    @ManyToOne(type => Api, api => api.apiPricing, {nullable: true})
    @JoinColumn()
    api: Api

    @OneToOne(type => Pricing, {nullable: true})
    @JoinColumn()
    pricing: Pricing
}