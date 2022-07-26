import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { IPayload, IPayloadSub } from './payload.interface';

export class JwtAdminStrategy extends PassportStrategy(
    Strategy,
    'jwtAdminGuard',
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
        if (!payload.isAdmin) {
            throw new UnauthorizedException();
        }

        return {
            id: payload.sub,
            email: payload.email,
            nickName: payload.nickName,
            isAdmin: payload.isAdmin ?? false,
        };
    }
}
