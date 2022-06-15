import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configConstant } from './common/constants/config.constant';
import { ApiModule } from './api/api.module';
import { PricingModule } from './pricing/pricing.module';
import { Api } from './entities/api.entity';
import { Category } from './entities/category.entity';
import { Discussion } from './entities/discussion.entity';
import { Endpoint } from './entities/endpoint.entity';
import { Organisation } from './entities/organisation.entity';
import { PriceGroup } from './entities/price-group.entity';
import { Pricing } from './entities/pricing.entity';
import { ProfileOrg } from './entities/profile-org.entity';
import { Profile } from './entities/profile.entity';
import { Tutorial } from './entities/tutorial.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get(configConstant.database.host),
        port: configService.get(configConstant.database.port),
        username: configService.get(configConstant.database.username),
        password: configService
          .get<string>(configConstant.database.password)
          ?.toString(),
        database: configService.get(configConstant.database.name),
        entities: [
          Api,
          Category,
          Discussion,
          Endpoint,
          Organisation,
          PriceGroup,
          Pricing,
          ProfileOrg,
          Profile,
          Tutorial,
        ],
        autoLoadEntities: true,
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    ApiModule,
    PricingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
