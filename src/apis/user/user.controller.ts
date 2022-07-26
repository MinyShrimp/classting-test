import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UserService } from './user.service';

@Controller('api')
export class UserController {
    constructor(
        private readonly userService: UserService, //
    ) {}

    /**
     * 회원 가입
     */
    @Post('/signup')
    async create(
        @Body() body: CreateUserDto, //
    ): Promise<string> {
        await this.userService.create(body);
        return '회원 가입이 완료되었습니다.';
    }
}
