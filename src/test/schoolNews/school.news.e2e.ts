import { v4 } from 'uuid';
import { INestApplication } from '@nestjs/common';

import { MESSAGES } from '../../commons/message/message.enum';

import { UserEntity } from '../../apis/user/entities/user.entity';
import { UserService } from '../../apis/user/user.service';
import { UserRepository } from '../../apis/user/entities/user.repository';

import { SchoolEntity } from '../../apis/school/entities/school.entity';
import { SchoolService } from '../../apis/school/school.service';

import { SchoolNewsEntity } from '../../apis/schoolNews/entities/schoolNews.entity';
import { SchoolNewsService } from '../../apis/schoolNews/schoolNews.service';
import { SchoolNewsRepository } from '../../apis/schoolNews/entities/schoolNews.repository';

import { SubscribeService } from '../../apis/subscribe/subscribe.service';

import { CreateTestModule, sendRequest } from '../createTestModule';
import { schoolNewsValues } from './values';

describe('학교 소식 테스트', () => {
    let app: INestApplication;

    let token: string;
    let tokens: Array<string>;

    let newsService: SchoolNewsService;
    let userRepository: UserRepository;
    let newsRepository: SchoolNewsRepository;

    let users: Array<UserEntity>;
    let schools: Array<SchoolEntity>;

    const userInputs = schoolNewsValues.userInputs;
    const newsInputs = schoolNewsValues.newsInputs;
    const schoolInputs = schoolNewsValues.schoolInputs;

    beforeAll(async () => {
        const load = await CreateTestModule();
        app = load.app;

        newsService = load.module.get(SchoolNewsService);

        userRepository = load.module.get(UserRepository);
        newsRepository = load.module.get(SchoolNewsRepository);

        // 회원 가입
        const userService = load.module.get(UserService);
        users = await Promise.all(
            userInputs.map((input) => {
                return userService.create(input);
            }),
        );

        // 관리자 권한 생성
        // ADMIN : 유저 0, 유저 1
        // USER  : 유저 2
        await userRepository.setAdmin(userInputs[0].email);
        await userRepository.setAdmin(userInputs[1].email);

        // 학교 페이지 생성
        // 유저 0 => 학교 0, 학교 1, 학교 2, 학교 3
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

        // 학교 구독
        // 유저 0 => x
        // 유저 1 => 학교 0, 학교 1
        // 유저 2 => 학교 2, 학교 3
        const subService = load.module.get(SubscribeService);
        await Promise.all(
            schools.map((school, idx) => {
                const userIdx = Math.floor(idx / 2) + 1;
                return subService.create(
                    {
                        id: users[userIdx].id,
                        email: users[userIdx].email,
                        nickName: users[userIdx].nickName,
                    },
                    { schoolID: school.id },
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
    });

    it('be defined', () => {
        expect(app).toBeDefined();

        expect(token).toBeDefined();
        expect(tokens).toBeDefined();

        expect(users).toBeDefined();
        expect(schools).toBeDefined();

        expect(newsService).toBeDefined();
        expect(newsRepository).toBeDefined();

        expect(userRepository).toBeDefined();
    });

    ///////////////////////////////////////////////////////////////////
    // 학교 뉴스 생성
    describe('POST /admin/school/news', () => {
        describe('정상 테스트', () => {
            afterEach(async () => {
                await newsRepository.deleteBySchoolID(schools[0].id);
            });

            it('요청', async () => {
                const res = await sendRequest(app)
                    .post('/admin/school/news')
                    .send({
                        schoolID: schools[0].id,
                        title: newsInputs[0].title,
                        contents: newsInputs[0].contents,
                    })
                    .set('Authorization', `Bearer ${tokens[0]}`)
                    .expect(201);
                expect(res.text).toEqual(MESSAGES.NEWS_CREATE_SUCCESS);
            });
        });

        describe('미권한', () => {
            it('일반 유저', async () => {
                const res = await sendRequest(app)
                    .post('/admin/school/news')
                    .send({
                        schoolID: schools[0].id,
                        title: newsInputs[0].title,
                        contents: newsInputs[0].contents,
                    })
                    .set('Authorization', `Bearer ${tokens[2]}`)
                    .expect(401);
                expect(res.text).toEqual(MESSAGES.UNAUTHORIZED);
            });

            it('다른 관리자', async () => {
                const res = await sendRequest(app)
                    .post('/admin/school/news')
                    .send({
                        schoolID: schools[0].id,
                        title: newsInputs[0].title,
                        contents: newsInputs[0].contents,
                    })
                    .set('Authorization', `Bearer ${tokens[1]}`)
                    .expect(401);
                expect(res.text).toEqual(MESSAGES.UNAUTHORIZED);
            });
        });

        describe('형식 불량', () => {
            it('토큰 누락', async () => {
                const res = await sendRequest(app)
                    .post(`/admin/school/news`)
                    .expect(401);
                expect(res.text).toEqual(MESSAGES.UNAUTHORIZED);
            });

            it('UUID 누락', async () => {
                const res = await sendRequest(app)
                    .post(`/admin/school/news`)
                    .send({
                        title: newsInputs[0].title,
                        contents: newsInputs[0].contents,
                    })
                    .set('Authorization', `Bearer ${tokens[0]}`)
                    .expect(400);
                expect(res.text).toEqual(MESSAGES.BAD_REQUEST);
            });

            it('제목 누락', async () => {
                const res = await sendRequest(app)
                    .post(`/admin/school/news`)
                    .send({
                        schoolID: schools[1].id,
                        contents: newsInputs[0].contents,
                    })
                    .set('Authorization', `Bearer ${tokens[0]}`)
                    .expect(400);
                expect(res.text).toEqual(MESSAGES.BAD_REQUEST);
            });

            it('내용 누락', async () => {
                const res = await sendRequest(app)
                    .post(`/admin/school/news`)
                    .send({
                        schoolID: schools[1].id,
                        title: newsInputs[0].title,
                    })
                    .set('Authorization', `Bearer ${tokens[0]}`)
                    .expect(400);
                expect(res.text).toEqual(MESSAGES.BAD_REQUEST);
            });

            it('이상한 UUID 입력', async () => {
                const res = await sendRequest(app)
                    .post(`/admin/school/news`)
                    .send({
                        schoolID: v4(),
                        title: newsInputs[0].title,
                        contents: newsInputs[0].contents,
                    })
                    .set('Authorization', `Bearer ${tokens[0]}`)
                    .expect(409);
                expect(res.text).toEqual(MESSAGES.SCHOOL_UNVALID);
            });
        });
    });

    ///////////////////////////////////////////////////////////////////
    // 학교 뉴스 수정
    describe('PUT /admin/school/news', () => {
        let news: Array<SchoolNewsEntity>;

        beforeEach(async () => {
            await newsRepository.create({
                userID: users[0].id,
                schoolID: schools[1].id,
                title: newsInputs[0].title,
                contents: newsInputs[0].contents,
            });

            news = await newsRepository.getBySchoolID(schools[1].id);
        });

        afterEach(async () => {
            await newsRepository.deleteBySchoolID(schools[1].id);
            news = undefined;
        });

        describe('정상 테스트', () => {
            it('제목 수정', async () => {
                expect(news).toBeDefined();

                const res = await sendRequest(app)
                    .put('/admin/school/news')
                    .send({
                        schoolNewsID: news[0].id,
                        title: '수정된 제목입니다.',
                    })
                    .set('Authorization', `Bearer ${tokens[0]}`)
                    .expect(200);
                expect(res.text).toEqual(MESSAGES.NEWS_UPDATE_SUCCESS);
            });

            it('내용 수정', async () => {
                expect(news).toBeDefined();

                const res = await sendRequest(app)
                    .put('/admin/school/news')
                    .send({
                        schoolNewsID: news[0].id,
                        contents: '수정된 내용입니다.',
                    })
                    .set('Authorization', `Bearer ${tokens[0]}`)
                    .expect(200);
                expect(res.text).toEqual(MESSAGES.NEWS_UPDATE_SUCCESS);
            });

            it('제목, 내용 수정', async () => {
                expect(news).toBeDefined();

                const res = await sendRequest(app)
                    .put('/admin/school/news')
                    .send({
                        schoolNewsID: news[0].id,
                        title: '수정된 제목입니다.',
                        contents: '수정된 내용입니다.',
                    })
                    .set('Authorization', `Bearer ${tokens[0]}`)
                    .expect(200);
                expect(res.text).toEqual(MESSAGES.NEWS_UPDATE_SUCCESS);
            });
        });

        describe('미권한', () => {
            it('일반 유저', async () => {
                const res = await sendRequest(app)
                    .put('/admin/school/news')
                    .send({
                        schoolNewsID: news[0].id,
                        title: newsInputs[0].title,
                        contents: newsInputs[0].contents,
                    })
                    .set('Authorization', `Bearer ${tokens[2]}`)
                    .expect(401);
                expect(res.text).toEqual(MESSAGES.UNAUTHORIZED);
            });

            it('다른 관리자', async () => {
                const res = await sendRequest(app)
                    .put('/admin/school/news')
                    .send({
                        schoolNewsID: news[0].id,
                        title: newsInputs[0].title,
                        contents: newsInputs[0].contents,
                    })
                    .set('Authorization', `Bearer ${tokens[1]}`)
                    .expect(401);
                expect(res.text).toEqual(MESSAGES.UNAUTHORIZED);
            });
        });

        describe('형식 불량', () => {
            it('토큰 누락', async () => {
                const res = await sendRequest(app)
                    .put(`/admin/school/news`)
                    .expect(401);
                expect(res.text).toEqual(MESSAGES.UNAUTHORIZED);
            });

            it('UUID 누락', async () => {
                const res = await sendRequest(app)
                    .put(`/admin/school/news`)
                    .send({
                        title: newsInputs[0].title,
                        contents: newsInputs[0].contents,
                    })
                    .set('Authorization', `Bearer ${tokens[0]}`)
                    .expect(400);
                expect(res.text).toEqual(MESSAGES.BAD_REQUEST);
            });

            it('이상한 UUID 입력', async () => {
                const res = await sendRequest(app)
                    .put(`/admin/school/news`)
                    .send({
                        schoolNewsID: v4(),
                        title: newsInputs[0].title,
                        contents: newsInputs[0].contents,
                    })
                    .set('Authorization', `Bearer ${tokens[0]}`)
                    .expect(409);
                expect(res.text).toEqual(MESSAGES.NEWS_UNVALID);
            });
        });
    });

    ///////////////////////////////////////////////////////////////////
    // 학교 뉴스 삭제
    describe('DELETE /admin/school/news', () => {
        let news: Array<SchoolNewsEntity>;

        beforeEach(async () => {
            await newsRepository.create({
                userID: users[0].id,
                schoolID: schools[1].id,
                title: newsInputs[0].title,
                contents: newsInputs[0].contents,
            });

            news = await newsRepository.getBySchoolID(schools[1].id);
        });

        afterEach(async () => {
            await newsRepository.deleteBySchoolID(schools[1].id);
            news = undefined;
        });

        describe('정상 테스트', () => {
            it('삭제', async () => {
                expect(news).toBeDefined();

                const res = await sendRequest(app)
                    .delete('/admin/school/news')
                    .send({
                        schoolNewsID: news[0].id,
                    })
                    .set('Authorization', `Bearer ${tokens[0]}`)
                    .expect(200);
                expect(res.text).toEqual(MESSAGES.NEWS_DELETE_SUCCESS);
            });
        });

        describe('미권한', () => {
            it('일반 유저', async () => {
                const res = await sendRequest(app)
                    .delete('/admin/school/news')
                    .send({
                        schoolNewsID: news[0].id,
                    })
                    .set('Authorization', `Bearer ${tokens[2]}`)
                    .expect(401);
                expect(res.text).toEqual(MESSAGES.UNAUTHORIZED);
            });

            it('다른 관리자', async () => {
                const res = await sendRequest(app)
                    .delete('/admin/school/news')
                    .send({
                        schoolNewsID: news[0].id,
                    })
                    .set('Authorization', `Bearer ${tokens[1]}`)
                    .expect(401);
                expect(res.text).toEqual(MESSAGES.UNAUTHORIZED);
            });
        });

        describe('형식 불량', () => {
            it('토큰 누락', async () => {
                const res = await sendRequest(app)
                    .delete(`/admin/school/news`)
                    .expect(401);
                expect(res.text).toEqual(MESSAGES.UNAUTHORIZED);
            });

            it('UUID 누락', async () => {
                const res = await sendRequest(app)
                    .delete(`/admin/school/news`)
                    .send({})
                    .set('Authorization', `Bearer ${tokens[0]}`)
                    .expect(400);
                expect(res.text).toEqual(MESSAGES.BAD_REQUEST);
            });

            it('이상한 UUID 입력', async () => {
                const res = await sendRequest(app)
                    .delete(`/admin/school/news`)
                    .send({
                        schoolNewsID: v4(),
                    })
                    .set('Authorization', `Bearer ${tokens[0]}`)
                    .expect(409);
                expect(res.text).toEqual(MESSAGES.NEWS_UNVALID);
            });
        });
    });

    ///////////////////////////////////////////////////////////////////
    // 학교 뉴스 삭제 취소
    describe('PATCH /admin/school/news', () => {
        let news: Array<SchoolNewsEntity>;

        beforeEach(async () => {
            await newsRepository.create({
                userID: users[0].id,
                schoolID: schools[2].id,
                title: newsInputs[2].title,
                contents: newsInputs[2].contents,
            });

            news = await newsRepository.getBySchoolID(schools[2].id);
            await newsRepository.delete({ schoolNewsID: news[0].id });
        });

        afterEach(async () => {
            await newsRepository.deleteBySchoolID(schools[2].id);
            news = undefined;
        });

        describe('정상 테스트', () => {
            it('삭제 취소', async () => {
                expect(news).toBeDefined();

                const res = await sendRequest(app)
                    .patch('/admin/school/news')
                    .send({
                        schoolNewsID: news[0].id,
                    })
                    .set('Authorization', `Bearer ${tokens[0]}`)
                    .expect(200);
                expect(res.text).toEqual(MESSAGES.NEWS_RESTORE_SUCCESS);
            });
        });

        describe('미권한', () => {
            it('일반 유저', async () => {
                const res = await sendRequest(app)
                    .patch('/admin/school/news')
                    .send({
                        schoolNewsID: news[0].id,
                    })
                    .set('Authorization', `Bearer ${tokens[2]}`)
                    .expect(401);
                expect(res.text).toEqual(MESSAGES.UNAUTHORIZED);
            });

            it('다른 관리자', async () => {
                const res = await sendRequest(app)
                    .patch('/admin/school/news')
                    .send({
                        schoolNewsID: news[0].id,
                    })
                    .set('Authorization', `Bearer ${tokens[1]}`)
                    .expect(401);
                expect(res.text).toEqual(MESSAGES.UNAUTHORIZED);
            });
        });

        describe('형식 불량', () => {
            it('토큰 누락', async () => {
                const res = await sendRequest(app)
                    .patch(`/admin/school/news`)
                    .expect(401);
                expect(res.text).toEqual(MESSAGES.UNAUTHORIZED);
            });

            it('UUID 누락', async () => {
                const res = await sendRequest(app)
                    .patch(`/admin/school/news`)
                    .send({})
                    .set('Authorization', `Bearer ${tokens[0]}`)
                    .expect(400);
                expect(res.text).toEqual(MESSAGES.BAD_REQUEST);
            });

            it('이상한 UUID 입력', async () => {
                const res = await sendRequest(app)
                    .patch(`/admin/school/news`)
                    .send({ schoolNewsID: v4() })
                    .set('Authorization', `Bearer ${tokens[0]}`)
                    .expect(409);
                expect(res.text).toEqual(MESSAGES.NEWS_UNVALID);
            });
        });
    });

    ///////////////////////////////////////////////////////////////////
    // 뉴스피드 조회
    describe('GET /api/newsfeed', () => {
        beforeEach(async () => {
            await Promise.all(
                newsInputs.map((input) => {
                    return newsService.create(
                        {
                            id: users[0].id,
                            email: users[0].email,
                            isAdmin: true,
                            nickName: users[0].nickName,
                        },
                        {
                            schoolID: schools[3].id,
                            title: input.title,
                            contents: input.contents,
                        },
                    );
                }),
            );
        });

        afterEach(async () => {
            await newsRepository.deleteBySchoolID(schools[3].id);
        });

        describe('정상 테스트', () => {
            it('요청 - 빈 값', async () => {
                const res = await sendRequest(app)
                    .get('/api/newsfeed')
                    .set('Authorization', `Bearer ${tokens[0]}`)
                    .expect(200);
                expect(res.body).toBeDefined();
                expect(res.body).toStrictEqual([]);
            });

            it('요청 - 유저 1', async () => {
                const res = await sendRequest(app)
                    .get('/api/newsfeed')
                    .set('Authorization', `Bearer ${tokens[1]}`)
                    .expect(200);
                expect(res.body).toBeDefined();
            });

            it('요청 - 유저 2', async () => {
                const res = await sendRequest(app)
                    .get('/api/newsfeed')
                    .set('Authorization', `Bearer ${tokens[2]}`)
                    .expect(200);
                expect(res.body).toBeDefined();
            });
        });

        describe('형식 불량', () => {
            it('토큰 누락', async () => {
                const res = await sendRequest(app)
                    .get('/api/newsfeed')
                    .expect(401);
                expect(res.text).toEqual(MESSAGES.UNAUTHORIZED);
            });
        });
    });
});
