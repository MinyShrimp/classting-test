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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Payload } from 'src/commons/auth/payload.param';
import { IPayload } from 'src/commons/auth/payload.interface';

import { CreateSchoolDto } from './dto/createSchool.dto';
import { UpdateSchoolDto } from './dto/updateSchool.dto';
import { DeleteSchoolDto } from './dto/deleteSchool.dto';

import { SchoolService } from './school.service';
import { SchoolEntity } from './entities/school.entity';
import { SchoolRepository } from './entities/school.repository';

@Controller('admin/school')
@UseGuards(AuthGuard('jwtAdminGuard'))
@ApiTags('학교 페이지')
@ApiBearerAuth('access-token')
export class SchoolController {
    constructor(
        private readonly schoolService: SchoolService, //
        private readonly schoolRepository: SchoolRepository,
    ) {}

    @Get('/')
    @ApiOperation({
        summary: '학교 페이지 조회 API',
        description: '내가 생성한 학교 페이지 목록 조회',
    })
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
    async createSchool(
        @Payload() payload: IPayload,
        @Body() dto: CreateSchoolDto, //
    ): Promise<string> {
        await this.schoolService.create(payload, dto);
        return '학교 페이지 생성에 성공했습니다.';
    }

    @Put('/')
    @ApiOperation({
        summary: '학교 페이지 수정 API',
        description: '학교 페이지 정보 수정',
    })
    async updateSchool(
        @Payload() payload: IPayload,
        @Body() dto: UpdateSchoolDto, //
    ): Promise<string> {
        const result = await this.schoolService.update(payload, dto);
        return result ? '수정을 완료했습니다.' : '수정을 실패했습니다.';
    }

    @Delete('/')
    @ApiOperation({
        summary: '학교 페이지 삭제 API',
        description: '학교 페이지 정보 삭제',
    })
    async deleteSchool(
        @Payload() payload: IPayload,
        @Body() dto: DeleteSchoolDto, //
    ): Promise<string> {
        const result = await this.schoolService.delete(payload, dto);
        return result ? '삭제를 완료했습니다.' : '삭제를 실패했습니다.';
    }
}
