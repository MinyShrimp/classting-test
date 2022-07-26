import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Matches } from 'class-validator';

export class LoginDto {
    @ApiProperty({
        example: 'qwer1234@gmail.com',
        description: '이메일',
        required: true,
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'qwer1234!',
        description:
            '8글자 이상, 영문자, 숫자, 특수문자가 1개 이상 포함된 비밀번호',
        required: true,
    })
    @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[a-zA-Z])(?=.*[$!%*#?&^_-]).{8,}$/, {
        message: '8글자이상의 영문자 + 숫자 + 특수문자로 구성되어야 합니다.',
    })
    pwd: string;
}
