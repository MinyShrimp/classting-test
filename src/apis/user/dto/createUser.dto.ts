import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length, Matches } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({
        example: '홍길동',
        description: '이름',
        required: true,
    })
    @Length(2, 10)
    name: string;

    @ApiProperty({
        example: '호부호형',
        description: '닉네임',
        required: true,
    })
    @Length(2, 8)
    nickName: string;

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
