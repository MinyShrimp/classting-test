import { IsNotEmpty } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

import { CreateSchoolDto } from './createSchool.dto';

export class UpdateSchoolDto extends PartialType(CreateSchoolDto) {
    @ApiProperty({
        example: '학교_UUID',
        description: '학교 UUID',
        required: true,
    })
    @IsNotEmpty()
    id: string;
}
