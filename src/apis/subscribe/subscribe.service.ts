import { Injectable, ConflictException } from '@nestjs/common';

import { IPayload } from 'src/commons/auth/payload.interface';
import { MESSAGES } from 'src/commons/message/message.enum';

import { UserService } from '../user/user.service';
import { SchoolService } from '../school/school.service';
import { SchoolNewsEntity } from '../schoolNews/entities/schoolNews.entity';

import { SubscribeDto } from './dto/subscribe.dto';
import { SubscribeCompositeKeyDto } from './dto/ck.dto';

import { SubscribeEntity } from './entities/subscribe.entity';
import { SubscribeRepository } from './entities/subscribe.repository';

@Injectable()
export class SubscribeService {
    constructor(
        private readonly userService: UserService,
        private readonly schoolService: SchoolService,
        private readonly subscribeRepository: SubscribeRepository, //
    ) {}

    /**
     * 존재 확인
     */
    async checkValid(
        dto: SubscribeCompositeKeyDto, //
    ): Promise<SubscribeEntity> {
        const check = await this.subscribeRepository.checkByCK(dto);
        if (!check) {
            throw new ConflictException(MESSAGES.SUBSCRIBE_UNVALID);
        }
        return check;
    }

    /**
     * 중복 확인
     */
    async checkOverlap(
        dto: SubscribeCompositeKeyDto, //
    ): Promise<void> {
        const check = await this.subscribeRepository.checkByCK(dto);
        if (check) {
            throw new ConflictException(MESSAGES.SUBSCRIBE_OVERLAP);
        }
    }

    /**
     * 학교 페이지별 소식 조회
     */
    async getNewsList(
        dto: SubscribeCompositeKeyDto, //
    ): Promise<SchoolNewsEntity[]> {
        // 존재 검사
        await this.checkValid(dto);
        return await this.subscribeRepository.getNewsList(dto);
    }

    /**
     * 구독
     */
    async create(
        payload: IPayload,
        dto: SubscribeDto, //
    ): Promise<SubscribeEntity> {
        // 중복 체크
        await this.checkOverlap({
            userID: payload.id,
            schoolID: dto.schoolID,
        });

        // 회원 조회
        const user = await this.userService.checkValid(payload.id);

        // 학교 조회
        const school = await this.schoolService.checkValid(dto.schoolID);

        if (school.userID === user.id) {
            throw new ConflictException(MESSAGES.SUBSCRIBE_AUTH);
        }

        return await this.subscribeRepository.create({
            user,
            school,
        });
    }

    /**
     * 구독 취소
     */
    async delete(
        payload: IPayload,
        dto: SubscribeDto, //
    ): Promise<boolean> {
        const ck = {
            userID: payload.id,
            schoolID: dto.schoolID,
        };

        // 구독이 되어있는지 확인
        await this.checkValid(ck);

        // 회원 확인
        await this.userService.checkValid(payload.id);

        const result = await this.subscribeRepository.delete(ck);
        return result.affected ? true : false;
    }
}
