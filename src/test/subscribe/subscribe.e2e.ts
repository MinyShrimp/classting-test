import { v4 } from 'uuid';
import { INestApplication } from '@nestjs/common';

import { MESSAGES } from '../../commons/message/message.enum';

import { UserEntity } from '../../apis/user/entities/user.entity';
import { UserService } from '../../apis/user/user.service';
import { UserRepository } from '../../apis/user/entities/user.repository';

import { SchoolEntity } from '../../apis/school/entities/school.entity';
import { SchoolService } from '../../apis/school/school.service';
import { SchoolRepository } from '../../apis/school/entities/school.repository';

import { SchoolNewsEntity } from '../../apis/schoolNews/entities/schoolNews.entity';
import { SchoolNewsService } from '../../apis/schoolNews/schoolNews.service';
import { SchoolNewsRepository } from '../../apis/schoolNews/entities/schoolNews.repository';

import { SubscribeEntity } from '../../apis/subscribe/entities/subscribe.entity';
import { SubscribeRepository } from '../../apis/subscribe/entities/subscribe.repository';
import { SubscribeCompositeKeyDto } from '../../apis/subscribe/dto/ck.dto';

import { subscribeValues } from './values';
import { CreateTestModule, sendRequest } from '../createTestModule';

describe('학교 구독 테스트', () => {
    let app: INestApplication;

    let token: string;
    let tokens: Array<string>;

    let userRepository: UserRepository;
    let schoolRepository: SchoolRepository;
    let subscribeRepository: SubscribeRepository;
    let schoolNewsRepository: SchoolNewsRepository;

    let users: Array<UserEntity>;
    let schools: Array<SchoolEntity>;

    const userInputs = subscribeValues.userInputs;
    const newsInputs = subscribeValues.newsInputs;
    const schoolInputs = subscribeValues.schoolInputs;

    beforeAll(async () => {
        const load = await CreateTestModule();
        app = load.app;
        userRepository = load.module.get(UserRepository);
        schoolRepository = load.module.get(SchoolRepository);
        subscribeRepository = load.module.get(SubscribeRepository);
        schoolNewsRepository = load.module.get(SchoolNewsRepository);

        // 회원 가입
        const userService = load.module.get(UserService);
        users = await Promise.all(
            userInputs.map((input) => {
                return userService.create(input);
            }),
        );

        // 관리자 권한 부여
        await userRepository.setAdmin(userInputs[0].email);
        await userRepository.setAdmin(userInputs[1].email);

        // 학교 페이지 생성
        const schoolService = load.module.get(SchoolService);
        schools = await Promise.all(
            schoolInputs.map((input) => {
                return schoolService.create(
                    {
                        id: users[0].id,
                        email: users[0].email,
                        nickName: users[0].nickName,
                    },
                    input,
                );
            }),
        );

        // 학교 소식 생성
        const newsService = load.module.get(SchoolNewsService);
        await Promise.all(
            newsInputs.map((input) => {
                return newsService.create(
                    {
                        id: users[0].id,
                        email: users[0].email,
                        nickName: users[0].nickName,
                    },
                    { ...input, schoolID: schools[0].id },
                );
            }),
        );

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
        await schoolRepository.bulkDelete(schoolInputs.map((v) => v.name));
    });

    it('be defined', () => {
        expect(app).toBeDefined();
        expect(token).toBeDefined();
        expect(tokens).toBeDefined();
        expect(schools).toBeDefined();
        expect(userRepository).toBeDefined();
        expect(schoolRepository).toBeDefined();
        expect(subscribeRepository).toBeDefined();
        expect(schoolNewsRepository).toBeDefined();
    });

    ///////////////////////////////////////////////////////////////////
    // 구독 중인 학교 목록
    describe('GET /api/subscribe/list', () => {
        describe('정상 테스트', () => {
            beforeAll(async () => {
                await Promise.all(
                    schools.map((school, idx) => {
                        return sendRequest(app)
                            .post('/api/subscribe')
                            .send({ schoolID: school.id })
                            .set(
                                'Authorization',
                                `Bearer ${tokens[Math.floor(idx / 2) + 1]}`,
                            );
                    }),
                );
            });

            afterAll(async () => {
                await subscribeRepository.bulkDelete(
                    schools.map(
                        (school, idx) =>
                            ({
                                schoolID: school.id,
                                userID: users[Math.floor(idx / 2) + 1].id,
                            } as SubscribeCompositeKeyDto),
                    ),
                );
            });

            it('요청 1 - 빈 값', async () => {
                const res = await sendRequest(app)
                    .get('/api/subscribe/list')
                    .set('Authorization', `Bearer ${tokens[0]}`)
                    .expect(200);
                expect(res.body).toBeDefined();
                expect(res.body).toBeInstanceOf(Array);
                expect(res.body).toStrictEqual([]);
            });

            it('요청 2 - 0, 1번 째 학교', async () => {
                const res = await sendRequest(app)
                    .get('/api/subscribe/list')
                    .set('Authorization', `Bearer ${tokens[1]}`)
                    .expect(200);
                expect(res.body).toBeDefined();
                expect(res.body).toBeInstanceOf(Array);

                const tmp = res.body.map((v: SubscribeEntity) => v.school.name);
                expect(schools.slice(0, 2).map((v) => v.name)).toStrictEqual(
                    expect.arrayContaining(tmp),
                );
            });

            it('요청 3 - 2, 3번 째 학교', async () => {
                const res = await sendRequest(app)
                    .get('/api/subscribe/list')
                    .set('Authorization', `Bearer ${tokens[2]}`)
                    .expect(200);
                expect(res.body).toBeDefined();
                expect(res.body).toBeInstanceOf(Array);

                const tmp = res.body.map((v: SubscribeEntity) => v.school.name);
                expect(schools.slice(2).map((v) => v.name)).toStrictEqual(
                    expect.arrayContaining(tmp),
                );
            });
        });

        describe('형식 불량', () => {
            it('토큰 누락', async () => {
                const res = await sendRequest(app)
                    .get('/api/subscribe/list')
                    .expect(401);
                expect(res.text).toEqual(MESSAGES.UNAUTHORIZED);
            });
        });
    });

    ///////////////////////////////////////////////////////////////////
    // 학교별 소식
    describe('GET /api/subscribe/news/:school', () => {
        describe('정상 테스트', () => {
            beforeAll(async () => {
                await Promise.all(
                    schools.map((school) => {
                        return sendRequest(app)
                            .post('/api/subscribe')
                            .send({ schoolID: school.id })
                            .set('Authorization', `Bearer ${tokens[2]}`);
                    }),
                );
            });

            afterAll(async () => {
                await subscribeRepository.bulkDelete(
                    schools.map(
                        (school) =>
                            ({
                                schoolID: school.id,
                                userID: users[2].id,
                            } as SubscribeCompositeKeyDto),
                    ),
                );
            });

            it('요청 1 - 빈 값', async () => {
                const res = await sendRequest(app)
                    .get(`/api/subscribe/news/${schools[1].id}`)
                    .set('Authorization', `Bearer ${tokens[2]}`)
                    .expect(200);
                expect(res.body).toBeDefined();
                expect(res.body).toBeInstanceOf(Array);
                expect(res.body).toStrictEqual([]);
            });

            it('요청 2 - 0 ~ 4번 째 소식', async () => {
                const res = await sendRequest(app)
                    .get(`/api/subscribe/news/${schools[0].id}`)
                    .set('Authorization', `Bearer ${tokens[2]}`)
                    .expect(200);
                expect(res.body).toBeDefined();
                expect(res.body).toBeInstanceOf(Array);
                expect(res.body.length).toEqual(4);

                const tmp = res.body.map((v: SchoolNewsEntity) => v.title);
                expect(newsInputs.map((v) => v.title)).toStrictEqual(
                    expect.arrayContaining(tmp),
                );

                // 시간 역순인지 확인
                let prev = new Date(res.body[0].createAt);
                for (let i = 1; i < res.body.length; i++) {
                    const now = new Date(res.body[i].createAt);
                    if (prev < now) {
                        expect(true).toEqual(false);
                    }
                    prev = now;
                }
                expect(true).toEqual(true);
            });
        });

        describe('형식 불량', () => {
            it('토큰 누락', async () => {
                const res = await sendRequest(app)
                    .get(`/api/subscribe/news/${schools[0].id}`)
                    .expect(401);
                expect(res.text).toEqual(MESSAGES.UNAUTHORIZED);
            });

            it('Param 누락', async () => {
                const res = await sendRequest(app)
                    .get(`/api/subscribe/news`)
                    .set('Authorization', `Bearer ${tokens[2]}`)
                    .expect(404);
                expect(res.text).toEqual('Cannot GET /api/subscribe/news');
            });

            it('잘못된 Param', async () => {
                const res = await sendRequest(app)
                    .get(`/api/subscribe/news/${v4()}`)
                    .set('Authorization', `Bearer ${tokens[2]}`)
                    .expect(409);
                expect(res.text).toEqual(MESSAGES.SUBSCRIBE_UNVALID);
            });
        });
    });

    ///////////////////////////////////////////////////////////////////
    // 구독
    describe('POST /api/subscribe', () => {
        afterAll(async () => {
            await subscribeRepository.bulkDelete([
                {
                    userID: users[2].id,
                    schoolID: schools[0].id,
                },
            ]);
        });

        describe('정상 테스트', () => {
            it('요청', async () => {
                const res = await sendRequest(app)
                    .post('/api/subscribe')
                    .send({ schoolID: schools[0].id })
                    .set('Authorization', `Bearer ${tokens[2]}`)
                    .expect(201);
                expect(res.text).toEqual(MESSAGES.SUBSCRIBE_CREATE_SUCCESS);
            });
        });

        describe('중복', () => {
            it('동일한 관리자', async () => {
                const res = await sendRequest(app)
                    .post('/api/subscribe')
                    .send({ schoolID: schools[0].id })
                    .set('Authorization', `Bearer ${tokens[0]}`)
                    .expect(409);
                expect(res.text).toEqual(MESSAGES.SUBSCRIBE_AUTH);
            });

            it('동일한 사람이 동일한 학교에 두 번 요청함', async () => {
                const res = await sendRequest(app)
                    .post('/api/subscribe')
                    .send({ schoolID: schools[0].id })
                    .set('Authorization', `Bearer ${tokens[2]}`)
                    .expect(409);
                expect(res.text).toEqual(MESSAGES.SUBSCRIBE_OVERLAP);
            });
        });

        describe('형식 불량', () => {
            it('토큰 누락', async () => {
                const res = await sendRequest(app)
                    .post('/api/subscribe')
                    .send({ schoolID: schools[0].id })
                    .expect(401);
                expect(res.text).toEqual(MESSAGES.UNAUTHORIZED);
            });

            it('UUID 미입력', async () => {
                const res = await sendRequest(app)
                    .post('/api/subscribe')
                    .send({ schoolID: '' })
                    .set('Authorization', `Bearer ${tokens[2]}`)
                    .expect(400);
                expect(res.text).toEqual(MESSAGES.BAD_REQUEST);
            });

            it('이상한 UUID 입력', async () => {
                const res = await sendRequest(app)
                    .post('/api/subscribe')
                    .send({ schoolID: v4() })
                    .set('Authorization', `Bearer ${tokens[2]}`)
                    .expect(409);
                expect(res.text).toEqual(MESSAGES.SCHOOL_UNVALID);
            });
        });
    });

    ///////////////////////////////////////////////////////////////////
    // 구독 취소
    describe('DELETE /api/subscribe', () => {
        describe('정상 테스트', () => {
            beforeAll(async () => {
                await sendRequest(app)
                    .post('/api/subscribe')
                    .send({ schoolID: schools[0].id })
                    .set('Authorization', `Bearer ${tokens[2]}`);
            });

            it('요청', async () => {
                const res = await sendRequest(app)
                    .delete('/api/subscribe')
                    .send({ schoolID: schools[0].id })
                    .set('Authorization', `Bearer ${tokens[2]}`)
                    .expect(200);
                expect(res.text).toEqual(MESSAGES.SUBSCRIBE_CANCLE_SUCCESS);
            });
        });

        describe('형식 불량', () => {
            it('토큰 누락', async () => {
                const res = await sendRequest(app)
                    .delete('/api/subscribe')
                    .send({ schoolID: schools[0].id })
                    .expect(401);
                expect(res.text).toEqual(MESSAGES.UNAUTHORIZED);
            });

            it('UUID 미입력', async () => {
                const res = await sendRequest(app)
                    .delete('/api/subscribe')
                    .send({ schoolID: '' })
                    .set('Authorization', `Bearer ${tokens[2]}`)
                    .expect(400);
                expect(res.text).toEqual(MESSAGES.BAD_REQUEST);
            });

            it('이상한 UUID 입력', async () => {
                const res = await sendRequest(app)
                    .delete('/api/subscribe')
                    .send({ schoolID: v4() })
                    .set('Authorization', `Bearer ${tokens[2]}`)
                    .expect(409);
                expect(res.text).toEqual(MESSAGES.SUBSCRIBE_UNVALID);
            });
        });
    });
});
