import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { JwtAdminStrategy } from '../../commons/auth/jwt-admin.strategy';
import { JwtAccessStrategy } from '../../commons/auth/jwt-access.strategy';
import { JwtRefreshStrategy } from '../../commons/auth/jwt-refresh.strategy';

import { UserModule } from '../user/user.module';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
    imports: [
        UserModule, //
        JwtModule.register({}),
    ],
    controllers: [
        AuthController, //
    ],
    providers: [
        AuthService, //
        JwtAdminStrategy,
        JwtAccessStrategy,
        JwtRefreshStrategy,
    ],
})
export class AuthModule {}
