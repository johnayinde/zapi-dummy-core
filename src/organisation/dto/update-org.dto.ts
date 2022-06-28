import { OrganisationDto } from './create-org.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateOrganisationDto extends PartialType(OrganisationDto) {}
