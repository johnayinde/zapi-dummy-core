import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  CountryResponseDto,
  CreateContactFormDto,
  TopicResponseDto,
} from './dto';
import { ContactUsService } from './contact-us.service';

@Controller('contact-us')
export class ContactUsController {
  constructor(private ContactUs: ContactUsService) {}

  @Get()
  getCountries(): CountryResponseDto[] {
    return this.ContactUs.getCountries();
  }

  @Get()
  getTopics(): TopicResponseDto[] {
    return this.ContactUs.getTopics();
  }

  @Post()
  createContactUs(@Body() payload: CreateContactFormDto) {
    return this.ContactUs.createContactUs(payload);
  }
}
