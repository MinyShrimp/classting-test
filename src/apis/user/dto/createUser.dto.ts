import { IsEmail, Length, Matches } from 'class-validator';

export class CreateUserDto {
    @Length(2, 10)
    name: string;

    @Length(2, 8)
    nickName: string;

    @IsEmail()
    email: string;

    @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[a-zA-Z])(?=.*[$!%*#?&^_-]).{8,}$/, {
        message: '8글자이상의 영문자 + 숫자 + 특수문자로 구성되어야 합니다.',
    })
    pwd: string;
}
