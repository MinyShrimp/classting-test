import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

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
    }): Promise<boolean> {
        const check = await this.userRepository
            .createQueryBuilder('user')
            .select(['user.email'])
            .where('user.email=:email', { email: dto.email })
            .orWhere('user.nickName=:nickName', { nickName: dto.nickName })
            .getOne();

        return check ? true : false;
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
                'uc.id',
            ])
            .where('user.email=:email', { email: email })
            .leftJoin('user.userClass', 'uc')
            .getOne();
    }

    async getOneByNickName(
        nickName: string, //
    ): Promise<UserEntity> {
        return await this.userRepository
            .createQueryBuilder('user')
            .select(['user.nickName'])
            .where('user.nickName=:nickName', { nickName: nickName })
            .getOne();
    }

    async getPwd(
        email: string, //
    ): Promise<string> {
        const entity = await this.userRepository
            .createQueryBuilder('user')
            .select(['user.email', 'user.pwd'])
            .where('user.email=:email', { email: email })
            .getOne();
        return entity.pwd;
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
}
