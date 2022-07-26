import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSchoolNewsDto {
    @ApiProperty({
        example: '학교_UUID',
        description: '학교 UUID',
        required: true,
    })
    @IsNotEmpty()
    schoolID: string;

    @ApiProperty({
        example: '제목',
        description: '소식 제목',
        required: true,
    })
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        example: '내용',
        description: '소식 내용',
        required: true,
    })
    @IsNotEmpty()
    contents: string;
}
