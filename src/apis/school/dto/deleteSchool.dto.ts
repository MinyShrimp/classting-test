import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteSchoolDto {
    @ApiProperty({
        example: '학교_UUID',
        description: '학교 UUID',
        required: true,
    })
    @IsNotEmpty()
    id: string;
}
