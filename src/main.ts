import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EEnvironments, getEnvironment } from './utils/helpers';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  if (getEnvironment() == EEnvironments.DEV) {
    console.log(getEnvironment());
    const config = new DocumentBuilder()
      .setTitle('Auction API')
      .setDescription('Auction API documentation')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/v1', app, document);
  }

  await app.listen(process.env.API_PORT);
}
bootstrap();
