import { Body, Controller, Post } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiOkResponse,
    ApiConflictResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/createUser.dto';
import { UserService } from './user.service';

@ApiTags('회원')
@Controller('api')
export class UserController {
    constructor(
        private readonly userService: UserService, //
    ) {}

    /**
     * 회원 가입
     */
    @Post('/signup')
    @ApiOperation({
        summary: '회원가입 API',
        description: '유저 회원가입',
    })
    @ApiOkResponse({ description: '회원 가입이 완료되었습니다.' })
    @ApiConflictResponse({ description: '이메일이나 닉네임이 중복되었습니다.' })
    async create(
        @Body() body: CreateUserDto, //
    ): Promise<string> {
        await this.userService.create(body);
        return '회원 가입이 완료되었습니다.';
    }
}
