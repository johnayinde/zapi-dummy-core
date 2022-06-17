import { OrgRole } from '../../common/enums/orgRole.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class OrgUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({
    enum: OrgRole,
    default: OrgRole.DEVELOPER,
  })
  role: OrgRole;
}
