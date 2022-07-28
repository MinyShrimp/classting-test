import {
    Catch,
    Logger,
    ArgumentsHost,
    HttpException,
    ExceptionFilter,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
    constructor() {}

    private logger = new Logger('Exception');

    catch(exception: HttpException, host: ArgumentsHost) {
        host.switchToHttp()
            .getResponse()
            .status(exception.getStatus())
            .send(exception.message);

        const msg = exception.message;
        const status = exception.getStatus();
        if (host.getArgs()[3]) {
            if (host.getArgs()[3].fieldName) {
                const where = host.getArgs()[3].fieldName;

                this.logger.warn(`[${status}] ${msg} - ${where}`);
                return exception;
            }
        }

        this.logger.warn(`[${status}] ${msg} - -`);

        return exception;
    }
}
