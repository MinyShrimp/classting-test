import { INestApplication } from '@nestjs/common';

import { MESSAGES } from '../../commons/message/message.enum';
import { UserService } from '../../apis/user/user.service';
import { UserRepository } from '../../apis/user/entities/user.repository';
import { SchoolRepository } from '../../apis/school/entities/school.repository';
import { SubscribeRepository } from '../../apis/subscribe/entities/subscribe.repository';
import { SchoolNewsRepository } from '../../apis/schoolNews/entities/schoolNews.repository';

import { CreateTestModule, sendRequest } from '../createTestModule';

describe('학교 구독 테스트', () => {
    let app: INestApplication;
    let token: string;
    let tokens: Array<string>;
    let userRepository: UserRepository;
    let schoolRepository: SchoolRepository;
    let subscribeRepository: SubscribeRepository;
    let schoolNewsRepository: SchoolNewsRepository;

    const userInputs = [
        {
            name: '김회민',
            nickName: '학교_구독_테스트_1',
            email: 'subscribetest01@gmail.com',
            pwd: 'qwer1234!',
        },
        {
            name: '김회민',
            nickName: '학교_구독_테스트_2',
            email: 'subscribetest02@gmail.com',
            pwd: 'qwer1234!',
        },
        {
            name: '김회민',
            nickName: '학교_구독_테스트_3',
            email: 'subscribetest03@gmail.com',
            pwd: 'qwer1234!',
        },
    ];

    const schoolInputs = [
        {
            name: '새우대학교 강릉지부',
            local: '강릉',
        },
        {
            name: '새우대학교 부산지부',
            local: '부산',
        },
        {
            name: '새우대학교 서울지부',
            local: '서울',
        },
        {
            name: '새우대학교 천안지부',
            local: '천안',
        },
    ];
    const schoolInput = schoolInputs[0];

    beforeAll(async () => {
        const load = await CreateTestModule();
        app = load.app;
        userRepository = load.module.get(UserRepository);
        schoolRepository = load.module.get(SchoolRepository);
        subscribeRepository = load.module.get(SubscribeRepository);

        // 회원 가입
        const userService = load.module.get(UserService);
        await Promise.all(
            userInputs.map((input) => {
                return userService.create(input);
            }),
        );

        await userRepository.setAdmin(userInputs[0].email);
        await userRepository.setAdmin(userInputs[1].email);

        // 유저 로그인
        tokens = (
            await Promise.all(
                userInputs.map((input) => {
                    return sendRequest(app).post('/auth/login').send({
                        email: input.email,
                        pwd: input.pwd,
                    });
                }),
            )
        ).map((res) => res.text);
        token = tokens[0];
    });

    afterAll(async () => {
        await userRepository.bulkDelete(userInputs.map((input) => input.email));
    });

    it('be defined', () => {
        expect(app).toBeDefined();
        expect(token).toBeDefined();
        expect(tokens).toBeDefined();
        expect(userRepository).toBeDefined();
        expect(schoolRepository).toBeDefined();
        expect(subscribeRepository).toBeDefined();
        expect(schoolNewsRepository).toBeDefined();
    });

    ///////////////////////////////////////////////////////////////////
    // 구독 중인 학교 목록
    describe('GET /api/subscribe/list', () => {});

    ///////////////////////////////////////////////////////////////////
    // 학교별 소식
    describe('GET /api/subscribe/news/:school', () => {});

    ///////////////////////////////////////////////////////////////////
    // 구독
    describe('POST /api/subscribe', () => {});

    ///////////////////////////////////////////////////////////////////
    // 구독 취소
    describe('DELETE /api/subscribe', () => {});
});
