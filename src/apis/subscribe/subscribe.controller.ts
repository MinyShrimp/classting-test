import { AuthGuard } from '@nestjs/passport';
import {
    Get,
    Post,
    Body,
    Param,
    Delete,
    Controller,
    UseGuards,
} from '@nestjs/common';
import {
    ApiTags,
    ApiParam,
    ApiOperation,
    ApiBearerAuth,
    ApiOkResponse,
    ApiCreatedResponse,
    ApiUnauthorizedResponse,
    ApiConflictResponse,
} from '@nestjs/swagger';

import { Payload } from '../../commons/auth/payload.param';
import { IPayload } from '../../commons/auth/payload.interface';
import { MESSAGES } from '../../commons/message/message.enum';

import { SchoolNewsEntity } from '../schoolNews/entities/schoolNews.entity';

import { SubscribeDto } from './dto/subscribe.dto';
import { SubscribeEntity } from './entities/subscribe.entity';
import { SubscribeRepository } from './entities/subscribe.repository';

import { SubscribeService } from './subscribe.service';

@Controller('api/subscribe')
@UseGuards(AuthGuard('jwtAccessGuard'))
@ApiTags('학교 구독')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({ description: MESSAGES.UNAUTHORIZED })
export class SubscribeController {
    constructor(
        private readonly subscribeService: SubscribeService, //
        private readonly subscribeRepository: SubscribeRepository,
    ) {}

    /**
     * 구독 중인 학교 목록 조회
     */
    @Get('/list')
    @ApiOperation({
        summary: '구독 중인 학교 목록 API',
        description: '구독 중인 학교 목록 조회',
    })
    async getSchoolList(
        @Payload() payload: IPayload, //
    ): Promise<SubscribeEntity[]> {
        return await this.subscribeRepository.getList(payload.id);
    }

    /**
     * 구독 중인 학교별 소식 조회
     */
    @Get('/news/:school')
    @ApiOperation({
        summary: '학교별 소식 API',
        description: '구독 중인 학교별 소식 조회',
    })
    @ApiParam({
        name: 'school',
        description: '학교 UUID',
        example: 'uuid',
    })
    @ApiConflictResponse({ description: MESSAGES.SUBSCRIBE_UNVALID })
    async getNewsList(
        @Payload() payload: IPayload,
        @Param('school') schoolID: string, //
    ): Promise<SchoolNewsEntity[]> {
        return await this.subscribeService.getNewsList({
            userID: payload.id,
            schoolID: schoolID,
        });
    }

    /**
     * 구독
     */
    @Post('/')
    @ApiOperation({
        summary: '구독 API',
        description: '구독',
    })
    @ApiCreatedResponse({ description: MESSAGES.SUBSCRIBE_CREATE_SUCCESS })
    @ApiConflictResponse({ description: MESSAGES.SUBSCRIBE_AUTH })
    async create(
        @Payload() payload: IPayload,
        @Body() dto: SubscribeDto, //
    ): Promise<string> {
        await this.subscribeService.create(payload, dto);
        return MESSAGES.SUBSCRIBE_CREATE_SUCCESS;
    }

    /**
     * 구독 취소
     */
    @Delete('/')
    @ApiOperation({
        summary: '구독 취소 API',
        description: '구독 취소',
    })
    @ApiOkResponse({ description: MESSAGES.SUBSCRIBE_CANCLE_SUCCESS })
    async delete(
        @Payload() payload: IPayload,
        @Body() dto: SubscribeDto, //
    ): Promise<string> {
        const result = await this.subscribeService.delete(payload, dto);
        return result
            ? MESSAGES.SUBSCRIBE_CANCLE_SUCCESS
            : MESSAGES.UNKNOWN_FAILED;
    }
}
