import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { IdCheckGuard } from './common/guards/idcheck.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalGuards(new IdCheckGuard())
  app.enableCors();
  app.setGlobalPrefix('api');

  if (process.env.NODE_ENV !== 'production') {
    const options = new DocumentBuilder()
      .setTitle('ZA DUMMY CORE')
      .setDescription('Zummit Africa Dummy Core BackEnd')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api-doc', app, document);
  }

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  await app.listen(Number(process.env.NODE_PORT) || 3000);
}
bootstrap();
