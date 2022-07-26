import { AuthGuard } from '@nestjs/passport';
import {
    Get,
    Put,
    Post,
    Delete,
    Body,
    UseGuards,
    Controller,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
    ApiOkResponse,
    ApiConflictResponse,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { Payload } from 'src/commons/auth/payload.param';
import { IPayload } from 'src/commons/auth/payload.interface';
import { MESSAGES } from 'src/commons/message/message.enum';

import { CreateSchoolDto } from './dto/createSchool.dto';
import { UpdateSchoolDto } from './dto/updateSchool.dto';
import { DeleteSchoolDto } from './dto/deleteSchool.dto';

import { SchoolEntity } from './entities/school.entity';
import { SchoolRepository } from './entities/school.repository';

import { SchoolService } from './school.service';

@Controller('admin/school')
@UseGuards(AuthGuard('jwtAdminGuard'))
@ApiTags('학교 페이지')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({ description: MESSAGES.UNAUTHORIZED })
export class SchoolController {
    constructor(
        private readonly schoolService: SchoolService, //
        private readonly schoolRepository: SchoolRepository,
    ) {}

    @Get('/my')
    @ApiOperation({
        summary: '학교 페이지 조회 API',
        description: '내가 생성한 학교 페이지 목록 조회',
    })
    @ApiOkResponse({ description: '내가 생성한 학교 페이지 목록' })
    @ApiUnauthorizedResponse({ description: MESSAGES.UNAUTHORIZED })
    async getMySchool(
        @Payload() payload: IPayload, //
    ): Promise<SchoolEntity[]> {
        return await this.schoolRepository.getMySchools(payload.id);
    }

    @Post('/')
    @ApiOperation({
        summary: '학교 페이지 생성 API',
        description: '학교 페이지 생성',
    })
    @ApiOkResponse({ description: MESSAGES.SCHOOL_CREATE_SUCCESS })
    @ApiConflictResponse({ description: MESSAGES.SCHOOL_OVERLAP })
    async createSchool(
        @Payload() payload: IPayload,
        @Body() dto: CreateSchoolDto, //
    ): Promise<string> {
        await this.schoolService.create(payload, dto);
        return MESSAGES.SCHOOL_CREATE_SUCCESS;
    }

    @Put('/')
    @ApiOperation({
        summary: '학교 페이지 수정 API',
        description: '학교 페이지 정보 수정',
    })
    @ApiOkResponse({ description: MESSAGES.SCHOOL_UPDATE_SUCCESS })
    @ApiConflictResponse({ description: MESSAGES.SCHOOL_UNVALID })
    async updateSchool(
        @Payload() payload: IPayload,
        @Body() dto: UpdateSchoolDto, //
    ): Promise<string> {
        const result = await this.schoolService.update(payload, dto);
        return result
            ? MESSAGES.SCHOOL_UPDATE_SUCCESS
            : MESSAGES.UNKNOWN_FAILED;
    }

    @Delete('/')
    @ApiOperation({
        summary: '학교 페이지 삭제 API',
        description: '학교 페이지 정보 삭제',
    })
    @ApiOkResponse({ description: MESSAGES.SCHOOL_DELETE_SUCCESS })
    @ApiConflictResponse({ description: MESSAGES.SCHOOL_UNVALID })
    async deleteSchool(
        @Payload() payload: IPayload,
        @Body() dto: DeleteSchoolDto, //
    ): Promise<string> {
        const result = await this.schoolService.delete(payload, dto);
        return result
            ? MESSAGES.SCHOOL_DELETE_SUCCESS
            : MESSAGES.UNKNOWN_FAILED;
    }
}
