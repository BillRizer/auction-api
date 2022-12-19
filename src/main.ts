import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EEnvironments, getEnvironment } from './utils/helpers';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.API_PORT);
}
bootstrap();
