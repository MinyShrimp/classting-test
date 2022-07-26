import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { UserEntity } from 'src/apis/user/entities/user.entity';
import { SchoolEntity } from 'src/apis/school/entities/school.entity';
import { SchoolNewsEntity } from 'src/apis/schoolNews/entities/schoolNews.entity';

import { SubscribeCompositeKeyDto } from '../dto/ck.dto';

import { SubscribeEntity } from './subscribe.entity';

@Injectable()
export class SubscribeRepository {
    constructor(
        @InjectRepository(SubscribeEntity)
        private readonly subscribeRepository: Repository<SubscribeEntity>, //
    ) {}

    async checkByCK(
        dto: SubscribeCompositeKeyDto, //
    ): Promise<SubscribeEntity> {
        return await this.subscribeRepository
            .createQueryBuilder('ss')
            .select(['ss.userID', 'ss.schoolID'])
            .where('ss.userID=:userID', { userID: dto.userID })
            .andWhere('ss.schoolID=:schoolID', { schoolID: dto.schoolID })
            .getOne();
    }

    /**
     * 구독 중인 학교 목록 조회
     */
    async getList(
        userID: string, //
    ): Promise<SubscribeEntity[]> {
        return await this.subscribeRepository
            .createQueryBuilder('ss')
            .select(['ss.createAt'])
            .leftJoinAndSelect('ss.school', 'school')
            .where('ss.userID=:userID', { userID: userID })
            .getMany();
    }

    /**
     * 학교를 구독 중인 유저 목록 조회
     */
    async getUserList(
        schoolID: string, //
    ): Promise<SubscribeEntity[]> {
        return await this.subscribeRepository
            .createQueryBuilder('ss')
            .select(['ss.createAt', 'ss.userID', 'ss.schoolID'])
            .where('ss.schoolID=:schoolID', { schoolID: schoolID })
            .getMany();
    }

    /**
     * 구독 중인 학교별 소식 조회
     */
    async getNewsList(
        dto: SubscribeCompositeKeyDto, //
    ): Promise<SchoolNewsEntity[]> {
        const entity = await this.subscribeRepository
            .createQueryBuilder('ss')
            .select([
                'ss.userID',
                'ss.schoolID',
                'news.id',
                'news.title',
                'news.contents',
                'news.createAt',
                'news.updateAt',
            ])
            .leftJoinAndSelect('ss.school', 'school')
            .leftJoin('school.news', 'news')
            .where('ss.userID=:userID', { userID: dto.userID })
            .andWhere('ss.schoolID=:schoolID', { schoolID: dto.schoolID })
            .orderBy('news.createAt', 'DESC')
            .getOne();

        return entity.school.news;
    }

    /**
     * 생성
     */
    async create(dto: {
        school: SchoolEntity;
        user: UserEntity; //
    }): Promise<SubscribeEntity> {
        return await this.subscribeRepository.save(dto);
    }

    /**
     * 삭제
     */
    async delete(
        dto: SubscribeCompositeKeyDto, //
    ): Promise<DeleteResult> {
        return await this.subscribeRepository.delete({ ...dto });
    }
}
