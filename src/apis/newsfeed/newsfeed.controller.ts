import { AuthGuard } from '@nestjs/passport';
import { Controller, Get, UseGuards } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
    ApiOkResponse,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { Payload } from '../../commons/auth/payload.param';
import { IPayload } from '../../commons/auth/payload.interface';
import { MESSAGES } from '../../commons/message/message.enum';

import { NewsfeedEntity } from './entities/newsfeed.entity';
import { NewsfeedRepository } from './entities/newsfeed.repository';

@Controller('api/newsfeed')
@UseGuards(AuthGuard('jwtAccessGuard'))
@ApiTags('뉴스 피드')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({ description: MESSAGES.UNAUTHORIZED })
export class NewsfeedController {
    constructor(
        private readonly newsfeedRepository: NewsfeedRepository, //
    ) {}

    @Get('/')
    @ApiOperation({
        summary: '뉴스피드 조회 API',
        description: '개인 뉴스피드 조회 API',
    })
    @ApiOkResponse({ description: '뉴스피드 목록' })
    async getMyNewsfeed(
        @Payload() payload: IPayload, //
    ): Promise<NewsfeedEntity[]> {
        return await this.newsfeedRepository.getMyNewsfeeds(payload.id);
    }
}
