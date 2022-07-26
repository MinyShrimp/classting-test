import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserRepository } from '../user/entities/user.repository';

import { LoginDto } from './dto/login.dto';
import { UserEntity } from '../user/entities/user.entity';
import { IPayload, IPayloadSub } from 'src/commons/auth/payload.interface';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userRepository: UserRepository, //
    ) {}

    /**
     * 비밀번호 비교
     */
    async comparePwd(dto: {
        pwd: string;
        hashPwd: string; //
    }): Promise<boolean> {
        return bcrypt.compareSync(dto.pwd, dto.hashPwd);
    }

    /**
     * JWT Payload Data
     */
    private getPayload(
        user: UserEntity, //
    ): IPayloadSub {
        const payload = {
            sub: user.id,
            email: user.email,
            nickName: user.nickName,
        };

        // 권한 처리
        if (user.userClass.id === 'ADMIN') {
            payload['isAdmin'] = true;
        }

        return payload;
    }

    /**
     * JWT Get Access Token
     * 만료 기간: 1시간
     */
    getAccessToken(
        user: UserEntity, //
    ): string {
        const payload = this.getPayload(user);
        return this.jwtService.sign(payload, {
            /* Options */
            secret: process.env.JWT_ACCESS_KEY,
            expiresIn: '1w',
        });
    }

    /**
     * JWT Set Refresh Token
     * 만료기간: 2주
     */
    setRefreshToken(
        res: Response,
        user: UserEntity, //
    ): string {
        const payload = this.getPayload(user);

        const refreshToken = this.jwtService.sign(payload, {
            /* Options */
            secret: process.env.JWT_REFRESH_KEY,
            expiresIn: '2w',
        });

        if (process.env.MODE === 'STAGE') {
            // docker 환경
            res.setHeader(
                'Set-Cookie',
                `refreshToken=${refreshToken}; path=/; domain=.jp.ngrok.io; SameSite=None; Secure; httpOnly;`,
            );
        } else {
            // 개발 환경
            res.setHeader(
                'Set-Cookie',
                `refreshToken=${refreshToken}; path=/; `,
            );
        }

        return refreshToken;
    }

    /**
     * 로그인
     */
    async login(
        res: Response,
        dto: LoginDto, //
    ): Promise<string> {
        // 회원 체크
        const user = await this.userRepository.getOneByEmail(dto.email);
        if (!user) {
            throw new ConflictException(
                '회원 데이터가 없습니다. 이메일을 확인해주세요.',
            );
        }

        // 비밀번호 확인
        const checkPwd = this.comparePwd({
            pwd: dto.pwd,
            hashPwd: user.pwd,
        });
        if (!checkPwd) {
            throw new ConflictException('비밀번호를 확인해주세요.');
        }

        // 로그인
        await this.userRepository.login(dto.email);

        // refrest token, access token
        this.setRefreshToken(res, user);
        return this.getAccessToken(user);
    }

    /**
     * 로그아웃
     */
    async logout(
        payload: IPayload, //
    ): Promise<boolean> {
        // 로그아웃
        const result = await this.userRepository.logout(payload.email);
        return result.affected ? true : false;
    }

    /**
     * access token 갱신
     */
    async restore(
        payload: IPayload, //
    ): Promise<string> {
        // 회원 체크
        const user = await this.userRepository.getOneByEmail(payload.email);
        if (!user) {
            throw new ConflictException(
                '회원 데이터가 없습니다. 이메일을 확인해주세요.',
            );
        }

        // access token
        return this.getAccessToken(user);
    }
}
