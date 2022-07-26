/**
 * HTTP 예외 필터
 */

import {
    Catch,
    ArgumentsHost,
    HttpException,
    ExceptionFilter,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
    constructor() {}

    catch(exception: HttpException, host: ArgumentsHost) {
        host.switchToHttp().getResponse().status(400).send(exception.message);
        return exception;
    }
}
