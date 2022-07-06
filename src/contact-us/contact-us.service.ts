import { Injectable } from '@nestjs/common';

import { helpTopics, countries, contactUs } from './db';
import {
  TopicResponseDto,
  CountryResponseDto,
  CreateContactFormDto,
  ContactFormDto,
} from './dto';

@Injectable()
export class ContactUsService {
  private topicNames = helpTopics;
  private countryNames = countries;
  private contactUs = contactUs;

  getCountries(): CountryResponseDto[] {
    return this.countryNames;
  }

  getTopics(): TopicResponseDto[] {
    return this.topicNames;
  }

  phoneNoCheck(phoneNo: string, countryId: string) {
    return this.contactUs.find((contact) => {
      return contact.phoneNo === phoneNo && contact.countryId === countryId;
    });
  }

  emailCheck(email: string) {
    return this.contactUs.find((contact) => {
      return contact.businessEmail === email;
    });
  }

  createContactUs(payload: CreateContactFormDto): ContactFormDto {
    const contactLength = this.contactUs.length + 2;
    const contactId: string = contactLength.toString();

    if (this.phoneNoCheck(payload.phoneNo, payload.countryId)) {
      //add data to existing phoneNo data
    } else if (this.emailCheck(payload.businessEmail)) {
      //add data to existing business email
    } else {
      const newContactUsData = {
        contactId,
        ...payload,
      };
      this.contactUs.push(newContactUsData);
      return newContactUsData;
    }
  }
}
