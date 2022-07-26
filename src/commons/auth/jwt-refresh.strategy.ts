import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';

import { IPayload, IPayloadSub } from './payload.interface';
import { getRefreshTokenInCookie } from './getRefreshTokenInCookie';

export class JwtRefreshStrategy extends PassportStrategy(
    Strategy,
    'jwtRefreshGuard',
) {
    constructor() {
        super({
            jwtFromRequest: getRefreshTokenInCookie,
            secretOrKey: process.env.JWT_REFRESH_KEY,
        });
    }

    async validate(
        payload: IPayloadSub, //
    ): Promise<IPayload> {
        return {
            id: payload.sub,
            email: payload.email,
            nickName: payload.nickName,
            isAdmin: payload.isAdmin ?? false,
        };
    }
}
