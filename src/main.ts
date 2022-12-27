import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EEnvironments, getEnvironment } from './utils/helpers';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import getLogLevels from './logger/geLogLevel';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: getLogLevels(getEnvironment()),
  });
  const versionApi = 'api/v1';

  app.setGlobalPrefix(versionApi);
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  if (getEnvironment() != EEnvironments.PROD) {
    console.log(getEnvironment());
    const config = new DocumentBuilder()
      .setTitle('Auction API')
      .setDescription('Auction API documentation')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(versionApi, app, document);
  }

  await app.listen(process.env.API_PORT);
}
bootstrap();
