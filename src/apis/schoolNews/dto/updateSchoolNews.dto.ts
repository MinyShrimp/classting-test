import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSchoolNewsDto {
    @ApiProperty({
        example: '학교_소식_UUID',
        description: '학교 소식 UUID',
        required: true,
    })
    @IsNotEmpty()
    schoolNewsID: string;

    @ApiProperty({
        example: '제목',
        description: '소식 제목',
        required: false,
    })
    title: string;

    @ApiProperty({
        example: '내용',
        description: '소식 내용',
        required: false,
    })
    contents: string;
}
