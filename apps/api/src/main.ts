// apps/api/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const port = process.env.API_PORT || 3001;
  await app.listen(port);
  Logger.log(`Aplicação rodando em: http://localhost:${port}`, 'Bootstrap');
}
bootstrap();