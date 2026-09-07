import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express from 'express';
import { join } from 'node:path';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: configService.get<string>('FRONTEND_URL') || 'http://localhost:5000',
    credentials: true,
  });

  // Phục vụ file tĩnh cho thư mục uploads cục bộ
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  app.setGlobalPrefix('api');

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        let firstMessage = 'Dữ liệu không hợp lệ';
        for (const err of errors) {
          if (err.constraints) {
            firstMessage = Object.values(err.constraints)[0];
            break;
          }
        }
        return new BadRequestException(firstMessage);
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('StoryVN API')
    .setDescription('Tài liệu và công cụ kiểm thử API StoryVN')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(configService.get<number>('PORT') ?? 3000);
}
await bootstrap();
