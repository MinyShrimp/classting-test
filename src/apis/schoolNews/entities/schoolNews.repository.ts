import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

import { DeleteSchoolNewsDto } from '../dto/deleteSchoolNews.dto';
import { UpdateSchoolNewsDto } from '../dto/updateSchoolNews.dto';
import { SchoolNewsEntity } from './schoolNews.entity';

@Injectable()
export class SchoolNewsRepository {
    constructor(
        @InjectRepository(SchoolNewsEntity)
        private readonly schoolNewsRepository: Repository<SchoolNewsEntity>,
    ) {}

    async getOneByID(
        newsID: string, //
    ): Promise<SchoolNewsEntity> {
        return await this.schoolNewsRepository
            .createQueryBuilder('news')
            .select(['news.id', 'user.id'])
            .leftJoin('news.user', 'user')
            .where('news.id=:newsID', { newsID: newsID })
            .getOne();
    }

    async getOneByIDWithDeleted(
        newsID: string, //
    ): Promise<SchoolNewsEntity> {
        return await this.schoolNewsRepository
            .createQueryBuilder('news')
            .withDeleted()
            .select(['news.id', 'user.id'])
            .leftJoin('news.user', 'user')
            .where('news.id=:newsID', { newsID: newsID })
            .getOne();
    }

    async create(
        dto: Partial<SchoolNewsEntity>, //
    ): Promise<SchoolNewsEntity> {
        return await this.schoolNewsRepository.save(dto);
    }

    async update(
        dto: UpdateSchoolNewsDto, //
    ): Promise<UpdateResult> {
        const { schoolNewsID, ...rest } = dto;
        return await this.schoolNewsRepository.update(
            { id: schoolNewsID },
            rest,
        );
    }

    async restore(
        dto: DeleteSchoolNewsDto, //
    ): Promise<DeleteResult> {
        return await this.schoolNewsRepository.restore({
            id: dto.schoolNewsID,
        });
    }

    async delete(
        dto: DeleteSchoolNewsDto, //
    ): Promise<DeleteResult> {
        return await this.schoolNewsRepository.softDelete({
            id: dto.schoolNewsID,
        });
    }
}
