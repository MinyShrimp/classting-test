import express from 'express';
import { AuthGuard } from '@nestjs/passport';
import { Body, Post, Response, UseGuards, Controller } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiOkResponse,
    ApiBearerAuth,
    ApiConflictResponse,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { Payload } from 'src/commons/auth/payload.param';
import { IPayload } from 'src/commons/auth/payload.interface';

import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';

@ApiTags('회원')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService, //
    ) {}

    @Post('/login')
    @ApiOperation({
        summary: '로그인 API',
        description: '유저 로그인',
    })
    @ApiOkResponse({ description: 'Json Web Token' })
    @ApiConflictResponse({ description: '회원 정보가 없습니다.' })
    async login(
        @Body() body: LoginDto, //
        @Response() res: express.Response,
    ): Promise<void> {
        res.send(await this.authService.login(res, body));
    }

    @UseGuards(AuthGuard('jwtAccessGuard'))
    @Post('/logout')
    @ApiOperation({
        summary: '로그아웃 API',
        description: '유저 로그아웃',
    })
    @ApiBearerAuth('access-token')
    @ApiOkResponse({ description: '로그아웃이 완료되었습니다.' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    async logout(
        @Payload() payload: IPayload, //
    ): Promise<string> {
        const result = await this.authService.logout(payload);
        return result
            ? '로그아웃이 완료되었습니다.'
            : '로그아웃을 실패했습니다.';
    }

    @UseGuards(AuthGuard('jwtRefreshGuard'))
    @Post('/restore')
    @ApiOperation({
        summary: '토큰 재발급 API',
        description: 'AccessToken 재발급',
    })
    @ApiOkResponse({ description: 'Json Web Token' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    async restore(
        @Payload() payload: IPayload, //
    ): Promise<string> {
        return this.authService.restore(payload);
    }
}
