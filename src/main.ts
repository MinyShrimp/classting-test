import * as morgan from 'morgan';
const morgan_json = require('morgan-json');
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { setupSwagger } from './commons/swagger/setup';
import { HttpExceptionFilter } from './commons/filter/http-exception.filter';

import {
    createLogger,
    ConsoleLoggerStream,
    ResponseLoggerStream,
} from './commons/logger/winston.config';
import { AppModule } from './app.module';
import { AppLoggerService } from './commons/logger/logger.service';

(async () => {
    createLogger();

    const app = await NestFactory.create(AppModule, {
        logger: new AppLoggerService(),
    });

    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new HttpExceptionFilter());

    app.use(
        morgan(
            morgan_json(
                ':date[iso] :remote-addr :remote-user :method :url :http-version :status :res[content-length] :response-time :referrer :user-agent',
                { stringify: true },
            ),
            { stream: ResponseLoggerStream },
        ),
    );
    app.use(
        morgan(
            ':remote-addr - :remote-user ":method :url HTTP/:http-version" :status (:response-time ms)',
            { stream: ConsoleLoggerStream },
        ),
    );

    setupSwagger(app);

    await app.listen(3001);
})();
