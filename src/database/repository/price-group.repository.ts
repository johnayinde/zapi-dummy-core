import { Injectable } from "@nestjs/common"
import { PriceGroup } from "src/entities/price-group.entity"
import { EntityRepository, Repository } from "typeorm"

@EntityRepository(PriceGroup)
export class PriceGroupRepository extends Repository<PriceGroup> {}