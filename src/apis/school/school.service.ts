import {
    Injectable,
    ConflictException,
    UnauthorizedException,
} from '@nestjs/common';

import { IPayload } from '../../commons/auth/payload.interface';
import { MESSAGES } from '../../commons/message/message.enum';

import { UserService } from '../user/user.service';

import { CreateSchoolDto } from './dto/createSchool.dto';
import { UpdateSchoolDto } from './dto/updateSchool.dto';
import { DeleteSchoolDto } from './dto/deleteSchool.dto';

import { SchoolEntity } from './entities/school.entity';
import { SchoolRepository } from './entities/school.repository';

@Injectable()
export class SchoolService {
    constructor(
        private readonly userSerivce: UserService,
        private readonly schoolRepository: SchoolRepository, //
    ) {}

    /**
     * 존재 검사
     */
    async checkValid(
        schoolID: string, //
    ): Promise<SchoolEntity> {
        const school = await this.schoolRepository.getOneByID(schoolID);
        if (!school) {
            throw new ConflictException(MESSAGES.SCHOOL_UNVALID);
        }
        return school;
    }

    /**
     * 중복 검사
     */
    async checkOverlapName(
        name: string, //
    ): Promise<void> {
        const school = await this.schoolRepository.getOneByName(name);
        if (school) {
            throw new ConflictException(MESSAGES.SCHOOL_OVERLAP);
        }
    }

    /**
     * 새로운 학교 페이지 생성
     */
    async create(
        payload: IPayload,
        dto: CreateSchoolDto, //
    ): Promise<SchoolEntity> {
        // 중복 검사
        await this.checkOverlapName(dto.name);

        // 회원 조회
        const user = await this.userSerivce.checkValid(payload.id);

        // 생성
        return await this.schoolRepository.create({
            ...dto,
            user,
        });
    }

    /**
     * 학교 페이지 정보 수정
     */
    async update(
        payload: IPayload,
        dto: UpdateSchoolDto, //
    ): Promise<boolean> {
        // 중복 검사
        if (dto.name) {
            await this.checkOverlapName(dto.name);
        }

        // 학교 페이지 조회
        const school = await this.checkValid(dto.id);

        // 회원 조회
        const user = await this.userSerivce.checkValid(payload.id);

        // 학교 페이지를 등록한 사람과 같은 사람인지 검사
        if (school.userID !== user.id) {
            throw new UnauthorizedException();
        }

        // 수정
        const result = await this.schoolRepository.update(dto);
        return result.affected ? true : false;
    }

    /**
     * 학교 페이지 삭제
     */
    async delete(
        payload: IPayload,
        dto: DeleteSchoolDto, //
    ): Promise<boolean> {
        // 학교 페이지 조회
        const school = await this.checkValid(dto.id);

        // 회원 조회
        const user = await this.userSerivce.checkValid(payload.id);

        // 학교 페이지를 등록한 사람과 같은 사람인지 검사
        if (school.userID !== user.id) {
            throw new UnauthorizedException();
        }

        // 삭제
        const result = await this.schoolRepository.delete(dto);
        return result.affected ? true : false;
    }
}
