import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

import { UserEntity } from './user.entity';

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    async checkOverlap(dto: {
        email: string;
        nickName: string;
    }): Promise<UserEntity> {
        return await this.userRepository
            .createQueryBuilder('user')
            .select(['user.email'])
            .where('user.email=:email', { email: dto.email })
            .orWhere('user.nickName=:nickName', { nickName: dto.nickName })
            .getOne();
    }

    async getOneByID(
        userID: string, //
    ): Promise<UserEntity> {
        return await this.userRepository
            .createQueryBuilder('user')
            .select(['user.id'])
            .where('user.id=:userID', { userID: userID })
            .getOne();
    }

    async getOneByEmail(
        email: string, //
    ): Promise<UserEntity> {
        return await this.userRepository
            .createQueryBuilder('user')
            .select([
                'user.id',
                'user.nickName',
                'user.email',
                'user.pwd',
                'user.userClassID',
            ])
            .where('user.email=:email', { email: email })
            .getOne();
    }

    async create(
        dto: Partial<
            Omit<UserEntity, 'id' | 'createAt' | 'updateAt' | 'deleteAt'>
        >,
    ): Promise<UserEntity> {
        return await this.userRepository.save(dto);
    }

    async login(
        email: string, //
    ): Promise<UpdateResult> {
        return await this.userRepository.update(
            { email: email },
            {
                isLogin: true,
                loginAt: new Date(),
            },
        );
    }

    async logout(
        email: string, //
    ): Promise<UpdateResult> {
        return await this.userRepository.update(
            { email: email },
            {
                isLogin: false,
                logoutAt: new Date(),
            },
        );
    }

    /**
     * 테스트용 함수
     * 특정 유저를 관리자로 바꾼다
     */
    async setAdmin(
        email: string, //
    ): Promise<UpdateResult> {
        return await this.userRepository.update(
            { email: email },
            { userClassID: 'ADMIN' },
        );
    }

    /**
     * 테스트용 함수
     * 내용물을 모두 비운다.
     */
    async bulkDelete(
        emails: Array<string>, //
    ): Promise<DeleteResult[]> {
        return await Promise.all(
            emails.map((email) => {
                return this.userRepository.delete({
                    email: email,
                });
            }),
        );
    }
}
