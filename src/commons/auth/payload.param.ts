import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IPayload } from './payload.interface';

export const Payload = createParamDecorator(
    (_, ctx: ExecutionContext): IPayload => {
        const req = ctx.switchToHttp().getRequest();
        return req.user as IPayload;
    }, //
);
