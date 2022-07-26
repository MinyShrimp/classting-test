import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from 'src/apis/user/entities/user.entity';

import { SchoolEntity } from './school.entity';
import { CreateSchoolDto } from '../dto/createSchool.dto';
import { UpdateSchoolDto } from '../dto/updateSchool.dto';
import { DeleteSchoolDto } from '../dto/deleteSchool.dto';

@Injectable()
export class SchoolRepository {
    constructor(
        @InjectRepository(SchoolEntity)
        private readonly schoolRepository: Repository<SchoolEntity>,
    ) {}

    async getOneByID(
        id: string, //
    ): Promise<SchoolEntity> {
        return await this.schoolRepository
            .createQueryBuilder('school')
            .select(['school.id', 'user.id'])
            .where('school.id=:id', { id })
            .leftJoin('school.user', 'user')
            .getOne();
    }

    async getOneByName(
        name: string, //
    ): Promise<SchoolEntity> {
        return await this.schoolRepository
            .createQueryBuilder('school')
            .select(['school.name'])
            .where('school.name=:name', { name })
            .getOne();
    }

    async getMySchools(
        userID: string, //
    ): Promise<SchoolEntity[]> {
        return await this.schoolRepository
            .createQueryBuilder('school')
            .select([
                'school.id',
                'school.name',
                'school.local',
                'school.createAt',
                'school.updateAt',
                'user.id',
            ])
            .leftJoin('school.user', 'user')
            .where('user.id=:userID', { userID: userID })
            .getMany();
    }

    async create(
        dto: CreateSchoolDto & { user: UserEntity }, //
    ): Promise<SchoolEntity> {
        return await this.schoolRepository.save(dto);
    }

    async update(
        dto: UpdateSchoolDto, //
    ): Promise<UpdateResult> {
        const { id, ...rest } = dto;
        return await this.schoolRepository.update({ id }, rest);
    }

    async delete(
        dto: DeleteSchoolDto, //
    ): Promise<DeleteResult> {
        return await this.schoolRepository.delete({ id: dto.id });
    }
}
