import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteSchoolNewsDto {
    @ApiProperty({
        example: '학교_소식_UUID',
        description: '학교 소식 UUID',
        required: true,
    })
    @IsNotEmpty()
    schoolNewsID: string;
}
