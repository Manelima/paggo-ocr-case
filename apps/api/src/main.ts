// apps/api/src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.enableCors({
    origin: 'http://localhost:3000', 
    credentials: true,
  });

  const port = process.env.API_PORT || 3001;

  await app.listen(port);
  Logger.log(
    ` Application is running on: http://localhost:${port}`,
    'Bootstrap',
  );
}
bootstrap();