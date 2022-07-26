import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { IPayload, IPayloadSub } from './payload.interface';

export class JwtAccessStrategy extends PassportStrategy(
    Strategy,
    'jwtAccessGuard',
) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_ACCESS_KEY,
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
