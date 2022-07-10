import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ContactFormDto {
  @IsNotEmpty()
  @IsString()
  contactId: string;
  @IsNotEmpty()
  @IsString()
  firstName: string;
  @IsNotEmpty()
  @IsString()
  lastName: string;
  @IsString()
  phoneNo: string;
  @IsEmail()
  @IsNotEmpty()
  businessEmail: string;
  // @IsNotEmpty()
  // @IsString()
  // countryId: string;
  @IsNotEmpty()
  @IsString()
  countryNames: string;
  @IsNotEmpty()
  @IsString()
  companyName: string;
  // @IsNotEmpty()
  // @IsString()
  // topicId: string;
  @IsNotEmpty()
  @IsString()
  topicName: string;
  @IsNotEmpty()
  @IsString()
  additionalInfo: string;
}

export class CreateContactFormDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;
  @IsNotEmpty()
  @IsString()
  lastName: string;
  @IsString()
  phoneNo: string;
  @IsEmail()
  @IsNotEmpty()
  businessEmail: string;
  @IsNotEmpty()
  @IsString()
  // countryId: string;
  // @IsNotEmpty()
  // @IsString()
  countryNames: string;
  @IsNotEmpty()
  @IsString()
  companyName: string;
  @IsNotEmpty()
  @IsString()
  topicName: string;
  @IsNotEmpty()
  @IsString()
  additionalInfo: string;
}

export class TopicResponseDto {
  // @IsNotEmpty()
  // @IsString()
  // topicId: string;
  @IsNotEmpty()
  @IsString()
  topicName: string;
}

export class CountryResponseDto {
  @IsNotEmpty()
  @IsString()
  countryId: string;
  @IsNotEmpty()
  @IsString()
  countryName: string;
}
