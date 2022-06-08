import { Injectable } from "@nestjs/common"
import { PriceGroup } from "src/entities/price-group.entity"
import { EntityRepository, Repository } from "typeorm"

@Injectable()
@EntityRepository(PriceGroup)
export class PriceGroupRepository extends Repository<PriceGroup> {}