import * as bcrypt from 'bcryptjs';
import { ConflictException, Injectable } from '@nestjs/common';

import { MESSAGES } from '../../commons/message/message.enum';

import { UserClassRepository } from '../userClass/entities/userClass.repository';

import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { UserRepository } from './entities/user.repository';

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
     * 존재 확인
     */
    async checkValid(
        userID: string, //
    ): Promise<UserEntity> {
        const check = await this.userRepository.getOneByID(userID);
        if (!check) {
            throw new ConflictException(MESSAGES.USER_UNVALID);
        }
        return check;
    }

    /**
     * 존재 확인
     */
    async checkValidByEmail(
        email: string, //
    ): Promise<UserEntity> {
        const check = await this.userRepository.getOneByEmail(email);
        if (!check) {
            throw new ConflictException(MESSAGES.USER_UNVALID);
        }
        return check;
    }

    /**
     * email, nickname 중복 확인
     */
    async checkOverlap(dto: {
        email: string;
        nickName: string; //
    }): Promise<void> {
        const check = await this.userRepository.checkOverlap(dto);
        if (check) {
            throw new ConflictException(MESSAGES.USER_OVERLAP);
        }
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
