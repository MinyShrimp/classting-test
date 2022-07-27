import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

import { MESSAGES } from '../../src/commons/message/message.enum';
import { UserRepository } from '../../src/apis/user/entities/user.repository';

import { CreateTestModule, sendRequest } from '../createTestModule';

describe('유저 통합 테스트', () => {
    let app: INestApplication;
    let userRepository: UserRepository;

    beforeAll(async () => {
        const load = await CreateTestModule();
        app = load.app;
        userRepository = load.module.get(UserRepository);
    });

    afterEach(async () => {
        await userRepository.clear();
    });

    it('be defined', () => {
        expect(app).toBeDefined();
    });

    describe('회원가입', () => {
        const info = {
            name: '김회민',
            nickName: '고래잡는새우2',
            email: 'ksk7774@gmail.com',
            pwd: 'qwer1234!',
        };

        describe('POST /api/signup', () => {
            it('정상 테스트', async () => {
                const res = await sendRequest(app)
                    .post('/api/signup')
                    .send(info)
                    .expect(201);
                expect(res.text).toEqual(MESSAGES.SIGNUP_SUCCESS);
            });

            it('이메일 형식', async () => {
                const res = await sendRequest(app)
                    .post('/api/signup')
                    .send({
                        ...info,
                        email: 'qwer1234',
                    })
                    .expect(400);
                expect(res.text).toEqual(MESSAGES.BAD_REQUEST);
            });

            it('비밀번호 형식', async () => {
                const res = await sendRequest(app)
                    .post('/api/signup')
                    .send({
                        ...info,
                        pwd: 'qwer1234',
                    })
                    .expect(400);
                expect(res.text).toEqual(MESSAGES.BAD_REQUEST);
            });

            it('이름 형식', async () => {
                const res = await sendRequest(app)
                    .post('/api/signup')
                    .send({
                        ...info,
                        name: '',
                    })
                    .expect(400);
                expect(res.text).toEqual(MESSAGES.BAD_REQUEST);
            });

            it('닉네임 형식', async () => {
                const res = await sendRequest(app)
                    .post('/api/signup')
                    .send({
                        ...info,
                        nickName: '',
                    })
                    .expect(400);
                expect(res.text).toEqual(MESSAGES.BAD_REQUEST);
            });
        });

        describe('POST /api/signup', () => {
            beforeEach(async () => {
                await sendRequest(app).post('/api/signup').send(info);
            });

            it('이메일 중복', async () => {
                const res = await sendRequest(app)
                    .post('/api/signup')
                    .send({
                        ...info,
                        nickName: 'test',
                    })
                    .expect(409);
                expect(res.text).toEqual(MESSAGES.USER_OVERLAP);
            });

            it('닉네임 중복', async () => {
                const res = await sendRequest(app)
                    .post('/api/signup')
                    .send({
                        ...info,
                        email: 'qwer1234@gmail.com',
                    })
                    .expect(409);
                expect(res.text).toEqual(MESSAGES.USER_OVERLAP);
            });
        });
    });
});
