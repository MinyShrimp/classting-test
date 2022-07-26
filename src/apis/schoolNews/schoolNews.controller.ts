import { AuthGuard } from '@nestjs/passport';
import {
    Put,
    Body,
    Post,
    Patch,
    Delete,
    UseGuards,
    Controller,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
    ApiOkResponse,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { Payload } from 'src/commons/auth/payload.param';
import { IPayload } from 'src/commons/auth/payload.interface';
import { MESSAGES } from 'src/commons/message/message.enum';

import { CreateSchoolNewsDto } from './dto/createSchoolNews.dto';
import { UpdateSchoolNewsDto } from './dto/updateSchoolNews.dto';
import { DeleteSchoolNewsDto } from './dto/deleteSchoolNews.dto';

import { SchoolNewsService } from './schoolNews.service';

@Controller('admin/school/news')
@UseGuards(AuthGuard('jwtAdminGuard'))
@ApiTags('학교 소식')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({ description: MESSAGES.UNAUTHORIZED })
export class SchoolNewsController {
    constructor(
        private readonly schoolNewsService: SchoolNewsService, //
    ) {}

    @Post('/')
    @ApiOperation({
        summary: '학교 뉴스 생성 API',
        description: '학교 뉴스 생성',
    })
    @ApiOkResponse({ description: '생성되었습니다.' })
    async create(
        @Payload() payload: IPayload,
        @Body() dto: CreateSchoolNewsDto, //
    ): Promise<string> {
        await this.schoolNewsService.create(payload, dto);
        return '생성되었습니다.';
    }

    @Put('/')
    @ApiOperation({
        summary: '학교 뉴스 수정 API',
        description: '학교 뉴스 수정',
    })
    @ApiOkResponse({ description: '수정되었습니다.' })
    async update(
        @Payload() payload: IPayload,
        @Body() dto: UpdateSchoolNewsDto, //
    ): Promise<string> {
        const result = await this.schoolNewsService.update(payload, dto);
        return result ? '수정되었습니다.' : '수정을 실패했습니다.';
    }

    @Patch('/')
    @ApiOperation({
        summary: '학교 뉴스 삭제 취소 API',
        description: '학교 뉴스 삭제 취소',
    })
    @ApiOkResponse({ description: '삭제 취소되었습니다.' })
    async restore(
        @Payload() payload: IPayload,
        @Body() dto: DeleteSchoolNewsDto, //
    ): Promise<string> {
        const result = await this.schoolNewsService.restore(payload, dto);
        return result ? '삭제 취소되었습니다.' : '삭제 취소를 실패했습니다.';
    }

    @Delete('/')
    @ApiOperation({
        summary: '학교 뉴스 삭제 API',
        description: '학교 뉴스 삭제',
    })
    @ApiOkResponse({ description: '삭제되었습니다.' })
    async elete(
        @Payload() payload: IPayload,
        @Body() dto: DeleteSchoolNewsDto, //
    ): Promise<string> {
        const result = await this.schoolNewsService.delete(payload, dto);
        return result ? '삭제되었습니다.' : '삭제를 실패했습니다.';
    }
}
