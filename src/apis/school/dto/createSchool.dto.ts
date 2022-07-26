import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSchoolDto {
    @ApiProperty({
        example: '새우대학교',
        description: '학교 이름',
        required: true,
    })
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: '서울',
        description: '학교 위치 ( 지역 )',
        required: true,
    })
    @IsNotEmpty()
    local: string;
}
