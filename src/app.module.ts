import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { ApiModule } from './api/api.module';
import { PricingModule } from './pricing/pricing.module';
import { OrganisationModule } from './organisation/organisation.module';
import { EndpointsModule } from './endpoints/endpoints.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { ProfileModule } from './profile/profile.module';
import { AppDataSource } from 'ormconfig';
import { PriceGroup } from './entities/price-group.entity';
import { APP_GUARD } from '@nestjs/core';
import { IdCheckGuard } from './common/guards/idcheck.guard';
import { ProfileService } from './profile/profile.service';
import { Profile } from './entities/profile.entity';
import { Api } from './entities/api.entity';
import { Category } from './entities/category.entity';
import { Endpoint } from './entities/endpoint.entity';
import { Organisation } from './entities/organisation.entity';
import { Pricing } from './entities/pricing.entity';
import { Subscription } from './entities/subscription.entity';
// import { DatabaseModule } from './databaseModule/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([Profile, Api, Category, Endpoint, Organisation, Pricing, Subscription]),
    TypeOrmModule.forRoot(AppDataSource.options),
    CategoriesModule,
    OrganisationModule,
    EndpointsModule,
    SubscriptionModule,
    ProfileModule,
    PricingModule,
    ApiModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: IdCheckGuard,
    },
  ],
})
export class AppModule {}
