import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { setupSwagger } from './commons/swagger/setup';
import { HttpExceptionFilter } from './commons/filter/http-exception.filter';

import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new HttpExceptionFilter());
    setupSwagger(app);

    await app.listen(3001);
}
bootstrap();
