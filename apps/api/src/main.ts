import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';

async function bootstrap() {
  const logger = new Logger('BengkelKu-API');
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT || 4000;
  const apiPrefix = process.env.API_PREFIX || 'api/v1';

  // Middlewares
  app.use(cookieParser());
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  // Global Prefix
  app.setGlobalPrefix(apiPrefix);

  // Global Pipes & Interceptors
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformResponseInterceptor());

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('BengkelKu API Documentation')
    .setDescription('Sistem Manajemen Bengkel Mobil & Motor Terintegrasi')
    .setVersion('1.0')
    .addBearerAuth()
    .addCookieAuth('bengkelku_access_token')
    .addTag('Auth', 'Autentikasi & Otorisasi Pengguna')
    .addTag('Users', 'Manajemen Pengguna & Role')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'BengkelKu API Docs',
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(port);
  logger.log(`🚀 BengkelKu Backend API running on http://localhost:${port}/${apiPrefix}`);
  logger.log(`📖 Swagger OpenAPI docs available at http://localhost:${port}/api/docs`);
}

bootstrap();
