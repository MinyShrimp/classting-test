import { INestApplication } from '@nestjs/common';

import { MESSAGES } from '../../commons/message/message.enum';
import { UserRepository } from '../../apis/user/entities/user.repository';

import { CreateTestModule, sendRequest } from '../createTestModule';

// Get JWT Payload
const parseJwt = (token: string) => {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
};

describe('인증 통합 테스트', () => {
    let app: INestApplication;
    let userRepository: UserRepository;

    const info = {
        name: '김회민',
        nickName: '고래잡는새우',
        email: 'ksk7584@gmail.com',
        pwd: 'qwer1234!',
    };

    beforeAll(async () => {
        const load = await CreateTestModule();
        app = load.app;
        userRepository = load.module.get(UserRepository);
    });

    afterAll(async () => {
        // 모두 비우기
        await userRepository.clear();
    });

    it('be defined', () => {
        expect(app).toBeDefined();
    });

    ///////////////////////////////////////////////////////////////////
    // 로그인
    describe('POST /auth/login', () => {
        beforeEach(async () => {
            // 회원 가입
            await sendRequest(app).post('/api/signup').send(info);
        });

        it('정상 테스트', async () => {
            const res = await sendRequest(app)
                .post('/auth/login')
                .send({
                    email: info.email,
                    pwd: info.pwd,
                })
                .expect(201);

            const cookies = res.headers['set-cookie'] as Array<string>;
            const access = res.text;

            expect(cookies).toBeDefined();
            expect(access).toBeDefined();

            const rToken = cookies.filter((cookie) =>
                cookie.includes('refreshToken'),
            )[0];
            const refresh = rToken
                .split(';')
                .map((v) => v.trim().split('='))[0][1];

            const aPayload = parseJwt(access);
            const rPayload = parseJwt(refresh);

            expect(
                aPayload['email'] === rPayload['email'] &&
                    info.email === aPayload['email'],
            ).toEqual(true);
        });

        describe('오류', () => {
            it('존재하지 않는 계정', async () => {
                const res = await sendRequest(app)
                    .post('/auth/login')
                    .send({
                        email: 'test@gmail.com',
                        pwd: 'qwer1234!',
                    })
                    .expect(409);
                expect(res.text).toEqual(MESSAGES.USER_UNVALID);
            });

            it('다른 비밀번호 입력', async () => {
                const res = await sendRequest(app)
                    .post('/auth/login')
                    .send({
                        email: info.email,
                        pwd: 'qwer123412@',
                    })
                    .expect(409);
                expect(res.text).toEqual(MESSAGES.USER_PASSWORD_UNVALID);
            });
        });

        describe('형식 불량', () => {
            it('이메일 형식 틀림', async () => {
                const res = await sendRequest(app)
                    .post('/auth/login')
                    .send({
                        email: 'test',
                        pwd: info.pwd,
                    })
                    .expect(400);
                expect(res.text).toEqual(MESSAGES.BAD_REQUEST);
            });

            it('비밀번호 형식 틀림', async () => {
                const res = await sendRequest(app)
                    .post('/auth/login')
                    .send({
                        email: info.email,
                        pwd: 'qwer1234',
                    })
                    .expect(400);
                expect(res.text).toEqual(MESSAGES.BAD_REQUEST);
            });
        });
    });

    ///////////////////////////////////////////////////////////////////
    // 로그아웃
    describe('POST /auth/logout', () => {
        let token: string;

        beforeEach(async () => {
            // 회원 가입
            await sendRequest(app).post('/api/signup').send(info);

            // 로그인
            const res = await sendRequest(app)
                .post('/auth/login')
                .send({
                    email: info.email,
                    pwd: info.pwd,
                })
                .expect(201);
            token = res.text;
        });

        it('정상 테스트', async () => {
            expect(token).toBeDefined();

            const res = await sendRequest(app)
                .post('/auth/logout')
                .set('Authorization', `Bearer ${token}`)
                .expect(201);
            expect(res.text).toEqual(MESSAGES.LOGOUT_SUCCESS);
        });

        it('토큰 누락', async () => {
            const res = await sendRequest(app).post('/auth/logout').expect(401);
            expect(res.text).toEqual(MESSAGES.UNAUTHORIZED);
        });
    });

    ///////////////////////////////////////////////////////////////////
    // 토큰 재발급
    describe('POST /auth/restore', () => {
        let token: string;

        beforeEach(async () => {
            // 회원 가입
            await sendRequest(app).post('/api/signup').send(info);

            // 로그인
            const res = await sendRequest(app)
                .post('/auth/login')
                .send({
                    email: info.email,
                    pwd: info.pwd,
                })
                .expect(201);

            const cookies = res.headers['set-cookie'] as Array<string>;

            const rToken = cookies.filter((cookie) =>
                cookie.includes('refreshToken'),
            )[0];
            token = rToken.split(';').map((v) => v.trim().split('='))[0][1];
        });

        it('정상 테스트', async () => {
            expect(token).toBeDefined();

            const res = await sendRequest(app)
                .post('/auth/restore')
                .set('cookie', `refreshToken=${token}`)
                .expect(201);

            const access = res.text;
            expect(access).toBeDefined();

            const aPayload = parseJwt(access);
            expect(info.email === aPayload['email']).toEqual(true);
        });

        it('토큰 누락', async () => {
            const res = await sendRequest(app)
                .post('/auth/restore')
                .expect(401);
            expect(res.text).toEqual(MESSAGES.UNAUTHORIZED);
        });
    });
});
