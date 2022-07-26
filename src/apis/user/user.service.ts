import * as bcrypt from 'bcryptjs';
import { ConflictException, Injectable } from '@nestjs/common';

import { UserClassRepository } from '../userClass/entities/userClass.repository';

import { CreateUserDto } from './dto/createUser';
import { UserRepository } from './entities/user.repository';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository, //
        private readonly userClassRepository: UserClassRepository,
    ) {}

    /**
     * Hashing 비밀번호 생성
     */
    createPassword(
        originPwd: string, //
    ): string {
        return bcrypt.hashSync(originPwd, bcrypt.genSaltSync());
    }

    /**
     * email, nickname 중복 확인
     */
    async checkOverlap(dto: {
        email: string;
        nickName: string; //
    }): Promise<boolean> {
        const check = await this.userRepository.checkOverlap(dto);
        if (check) {
            throw new ConflictException('이메일이나 닉네임이 중복되었습니다.');
        }
        return true;
    }

    /**
     * 회원 가입
     */
    async create(
        dto: CreateUserDto, //
    ): Promise<UserEntity> {
        // overlap check
        await this.checkOverlap(dto);

        // User 등급 가져오기 ( default: 'USER' )
        const userClass = await this.userClassRepository.getOne();

        // 회원가입
        return await this.userRepository.create({
            ...dto,
            pwd: this.createPassword(dto.pwd),
            userClass,
        });
    }
}
