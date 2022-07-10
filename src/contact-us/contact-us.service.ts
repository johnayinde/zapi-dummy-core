import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ZapiResponse } from 'src/common/helpers/response';
import { ContactUs } from 'src/entities/contact-us.entity';
import { Repository } from 'typeorm';

import { helpTopics, countries } from './db';
import {
  TopicResponseDto,
  CountryResponseDto,
  CreateContactFormDto,
} from './dto';

@Injectable()
export class ContactUsService {
  private topicNames = helpTopics;
  private countryNames = countries;

  constructor(
    @InjectRepository(ContactUs)
    private readonly contactUsRepository: Repository<ContactUs>,
  ) {}

  // list of country names
  getCountries(): CountryResponseDto[] {
    return this.countryNames;
  }

  //  list of possible topics
  getTopics(): TopicResponseDto[] {
    return this.topicNames;
  }

  // organise contact details by phone-no and eamil-address

  // send newly created contactus to support email address
  async sendContactDetailsToSupport() {}

  // save contact details
  async createContactUs(payload: CreateContactFormDto) {
    try {
      const newContactUsDetails = this.contactUsRepository.create(payload);

      this.contactUsRepository.save(newContactUsDetails);

      return newContactUsDetails;
    } catch (e) {
      console.log(e);
      throw new BadRequestException(
        ZapiResponse.BadRequest('error saving data', e),
      );
    }
  }
}
