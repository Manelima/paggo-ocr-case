// apps/api/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const frontendUrl = process.env.FRONTEND_URL;

  if (frontendUrl) {
    Logger.log(`Configurando CORS para a origem: ${frontendUrl}`, 'Bootstrap');
  } else {
    Logger.warn(`Variável de ambiente FRONTEND_URL não definida!`, 'Bootstrap');
  }

  app.enableCors({
    origin: frontendUrl, 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });


  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const port = process.env.API_PORT || 3001;
  await app.listen(port);
  Logger.log(`Aplicação rodando em: http://localhost:${port}`, 'Bootstrap');
}
bootstrap();