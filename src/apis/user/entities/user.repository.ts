import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
            .select(['user.id', 'user.email'])
            .where('user.email=:email', { email: dto.email })
            .orWhere('user.nickName=:nickName', { nickName: dto.nickName })
            .getOne();

        return check ? true : false;
    }

    async create(
        dto: Partial<
            Omit<UserEntity, 'id' | 'createAt' | 'updateAt' | 'deleteAt'>
        >,
    ): Promise<UserEntity> {
        return await this.userRepository.save(dto);
    }
}
