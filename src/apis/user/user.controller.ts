import { Body, Controller, Post } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiOkResponse,
    ApiConflictResponse,
} from '@nestjs/swagger';

import { MESSAGES } from 'src/commons/message/message.enum';

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
    @ApiOkResponse({ description: MESSAGES.SIGNUP_SUCCESS })
    @ApiConflictResponse({ description: MESSAGES.USER_OVERLAP })
    async create(
        @Body() body: CreateUserDto, //
    ): Promise<string> {
        await this.userService.create(body);
        return MESSAGES.SIGNUP_SUCCESS;
    }
}
