import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { OrgUserDto } from './create-user.dto';

export class DeleteUserDto extends PartialType(OrgUserDto) {}
