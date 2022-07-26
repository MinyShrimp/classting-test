import {
    Injectable,
    ConflictException,
    UnauthorizedException,
} from '@nestjs/common';

import { IPayload } from 'src/commons/auth/payload.interface';

import { UserService } from '../user/user.service';
import { SchoolService } from '../school/school.service';
import { NewsfeedService } from '../newsfeed/newsfeed.service';
import { SubscribeRepository } from '../subscribe/entities/subscribe.repository';

import { CreateSchoolNewsDto } from './dto/createSchoolNews.dto';
import { UpdateSchoolNewsDto } from './dto/updateSchoolNews.dto';
import { DeleteSchoolNewsDto } from './dto/deleteSchoolNews.dto';

import { SchoolNewsEntity } from './entities/schoolNews.entity';
import { SchoolNewsRepository } from './entities/schoolNews.repository';

@Injectable()
export class SchoolNewsService {
    constructor(
        private readonly userService: UserService,
        private readonly schoolService: SchoolService,
        private readonly newsfeedService: NewsfeedService,
        private readonly subscribeRepository: SubscribeRepository,
        private readonly schoolNewsRepository: SchoolNewsRepository, //
    ) {}

    /**
     * SchoolNews가 있는지 확인
     */
    async checkValid(
        schoolNewsID: string, //
    ): Promise<SchoolNewsEntity> {
        const news = await this.schoolNewsRepository.getOneByID(schoolNewsID);
        if (!news) {
            throw new ConflictException('학교 소식 정보가 없습니다.');
        }
        return news;
    }

    /**
     * SchoolNews가 있는지 확인 ( with deleted )
     */
    async checkValidWithDeleted(
        schoolNewsID: string, //
    ): Promise<SchoolNewsEntity> {
        const news = await this.schoolNewsRepository.getOneByIDWithDeleted(
            schoolNewsID,
        );
        if (!news) {
            throw new ConflictException('학교 소식 정보가 없습니다.');
        }
        return news;
    }

    /**
     * 생성
     */
    async create(
        payload: IPayload,
        dto: CreateSchoolNewsDto, //
    ): Promise<SchoolNewsEntity> {
        const { schoolID, ...rest } = dto;

        // 유저 조회
        const user = await this.userService.checkValid(payload.id);

        // 학교 조회
        const school = await this.schoolService.checkValid(schoolID);

        // 신청한 유저와 학교 관리자가 같은지 확인
        if (user.id !== school.userID) {
            throw new UnauthorizedException();
        }

        // 생성
        const result = await this.schoolNewsRepository.create({
            ...rest,
            user: user,
            school: school,
        });

        // 이 학교를 구독 중인 유저 목록 조회
        const subs = await this.subscribeRepository.getUserList(schoolID);

        // newsfeed에 생성 ( 비동기 )
        this.newsfeedService.giveNewsToSubs({
            userIDs: subs.map((v) => v.userID),
            newsID: result.id,
        });

        return result;
    }

    /**
     * 수정
     */
    async update(
        payload: IPayload,
        dto: UpdateSchoolNewsDto, //
    ): Promise<boolean> {
        const { schoolNewsID, ..._ } = dto;

        // 유저 조회
        const user = await this.userService.checkValid(payload.id);

        // 학교 조회
        const news = await this.checkValid(schoolNewsID);

        // 신청한 유저와 학교 관리자가 같은지 확인
        if (user.id !== news.userID) {
            throw new UnauthorizedException();
        }

        const result = await this.schoolNewsRepository.update(dto);
        return result.affected ? true : false;
    }

    /**
     * 삭제 취소
     */
    async restore(
        payload: IPayload,
        dto: DeleteSchoolNewsDto, //
    ): Promise<boolean> {
        // 유저 조회
        const user = await this.userService.checkValid(payload.id);

        // 학교 조회
        const news = await this.checkValidWithDeleted(dto.schoolNewsID);

        // 신청한 유저와 학교 관리자가 같은지 확인
        if (user.id !== news.userID) {
            throw new UnauthorizedException();
        }

        const result = await this.schoolNewsRepository.restore(dto);
        return result.affected ? true : false;
    }

    /**
     * 삭제
     */
    async delete(
        payload: IPayload,
        dto: DeleteSchoolNewsDto, //
    ): Promise<boolean> {
        // 유저 조회
        const user = await this.userService.checkValid(payload.id);

        // 학교 조회
        const news = await this.checkValid(dto.schoolNewsID);

        // 신청한 유저와 학교 관리자가 같은지 확인
        if (user.id !== news.userID) {
            throw new UnauthorizedException();
        }

        const result = await this.schoolNewsRepository.delete(dto);
        return result.affected ? true : false;
    }
}
