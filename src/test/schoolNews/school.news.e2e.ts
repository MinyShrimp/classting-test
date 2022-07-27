import { INestApplication } from '@nestjs/common';

import { MESSAGES } from '../../commons/message/message.enum';
import { UserService } from '../../apis/user/user.service';
import { UserRepository } from '../../apis/user/entities/user.repository';
import { SchoolRepository } from '../../apis/school/entities/school.repository';
import { NewsfeedRepository } from '../../apis/newsfeed/entities/newsfeed.repository';
import { SchoolNewsRepository } from '../../apis/schoolNews/entities/schoolNews.repository';

import { CreateTestModule, sendRequest } from '../createTestModule';

describe('학교 소식 테스트', () => {
    let app: INestApplication;
    let token: string;
    let tokens: Array<string>;
    let userRepository: UserRepository;
    let schoolRepository: SchoolRepository;
    let newsfeedRepository: NewsfeedRepository;
    let schoolNewsRepository: SchoolNewsRepository;

    const userInputs = [
        {
            name: '김회민',
            nickName: '학교_소식_테스트_1',
            email: 'schoolnewstest01@gmail.com',
            pwd: 'qwer1234!',
        },
        {
            name: '김회민',
            nickName: '학교_소식_테스트_2',
            email: 'schoolnewstest02@gmail.com',
            pwd: 'qwer1234!',
        },
        {
            name: '김회민',
            nickName: '학교_소식_테스트_3',
            email: 'schoolnewstest03@gmail.com',
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
        newsfeedRepository = load.module.get(NewsfeedRepository);
        schoolNewsRepository = load.module.get(SchoolNewsRepository);

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
        expect(newsfeedRepository).toBeDefined();
        expect(schoolNewsRepository).toBeDefined();
    });

    ///////////////////////////////////////////////////////////////////
    // 학교 뉴스 생성
    describe('POST /admin/school/news', () => {});

    ///////////////////////////////////////////////////////////////////
    // 학교 뉴스 수정
    describe('PUT /admin/school/news', () => {});

    ///////////////////////////////////////////////////////////////////
    // 학교 뉴스 삭제 취소
    describe('PATCH /admin/school/news', () => {});

    ///////////////////////////////////////////////////////////////////
    // 학교 뉴스 삭제
    describe('DELETE /admin/school/news', () => {});

    ///////////////////////////////////////////////////////////////////
    // 뉴스피드 조회
    describe('GET /api/newsfeed', () => {});
});
