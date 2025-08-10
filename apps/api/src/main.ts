// apps/api/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const whitelist = [
    'http://localhost:3000',
    process.env.FRONTEND_URL,
  ];

  app.enableCors({
    origin: function (origin, callback) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        Logger.error(`Origem não permitida pelo CORS: ${origin}`, 'CORS');
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const port = process.env.API_PORT || 3001;
  await app.listen(port);
  Logger.log(`Application is running on: http://localhost:${port}`, 'Bootstrap');
}
bootstrap();