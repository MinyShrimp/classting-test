import { v4 } from 'uuid';
import { INestApplication } from '@nestjs/common';

import { MESSAGES } from '../../commons/message/message.enum';
import { SchoolEntity } from '../../apis/school/entities/school.entity';
import { UserRepository } from '../../apis/user/entities/user.repository';
import { SchoolRepository } from '../../apis/school/entities/school.repository';
import { UserService } from '../../apis/user/user.service';

import { CreateTestModule, sendRequest } from '../createTestModule';

describe('학교 페이지 테스트', () => {
    let app: INestApplication;
    let token: string;
    let tokens: Array<string>;
    let userRepository: UserRepository;
    let schoolRepository: SchoolRepository;

    const userInputs = [
        {
            name: '김회민',
            nickName: '학교_페이지_테스트_1',
            email: 'schooltest01@gmail.com',
            pwd: 'qwer1234!',
        },
        {
            name: '김회민',
            nickName: '학교_페이지_테스트_2',
            email: 'schooltest02@gmail.com',
            pwd: 'qwer1234!',
        },
        {
            name: '김회민',
            nickName: '학교_페이지_테스트_3',
            email: 'schooltest03@gmail.com',
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
        expect(userRepository).toBeDefined();
        expect(schoolRepository).toBeDefined();
    });

    ///////////////////////////////////////////////////////////////////
    // 자신이 생성한 학교 페이지 목록 조회
    describe('GET /admin/school/my', () => {
        afterEach(async () => {
            await schoolRepository.clear();
        });

        describe('정상 테스트', () => {
            it('빈값', async () => {
                const res = await sendRequest(app)
                    .get('/admin/school/my')
                    .set('Authorization', `Bearer ${token}`)
                    .expect(200);
                expect(res.body).toStrictEqual([]);
            });

            it('생성한 학교 페이지 목록', async () => {
                // 생성
                await Promise.all(
                    schoolInputs.map((v) =>
                        sendRequest(app)
                            .post('/admin/school')
                            .send(v)
                            .set('Authorization', `Bearer ${token}`),
                    ),
                );

                // 조회
                const res = await sendRequest(app)
                    .get('/admin/school/my')
                    .set('Authorization', `Bearer ${token}`)
                    .expect(200);
                expect(res.body).toBeDefined();
                expect(res.body).toBeInstanceOf(Array);

                const tmp = res.body.map((v: SchoolEntity) => ({
                    local: v.local,
                    name: v.name,
                }));
                expect(tmp).toStrictEqual(expect.arrayContaining(schoolInputs));
            });
        });

        describe('미권한 유저', () => {
            it('요청', async () => {
                const res = await sendRequest(app)
                    .get('/admin/school/my')
                    .set('Authorization', `Bearer ${tokens[2]}`)
                    .expect(401);
                expect(res.text).toEqual(MESSAGES.UNAUTHORIZED);
            });
        });

        describe('형식 불량', () => {
            it('토큰 누락', async () => {
                const res = await sendRequest(app)
                    .get('/admin/school/my')
                    .expect(401);
                expect(res.text).toEqual(MESSAGES.UNAUTHORIZED);
            });
        });
    });

    ///////////////////////////////////////////////////////////////////
    // 학교 페이지 생성
    describe('POST /admin/school', () => {
        afterEach(async () => {
            await schoolRepository.clear();
        });

        describe('정상 테스트', () => {
            it('단일 생성', async () => {
                const res = await sendRequest(app)
                    .post('/admin/school')
                    .send(schoolInput)
                    .set('Authorization', `Bearer ${token}`)
                    .expect(201);
                expect(res.text).toEqual(MESSAGES.SCHOOL_CREATE_SUCCESS);
            });

            it('다중 생성', async () => {
                const reses = await Promise.all(
                    schoolInputs.map((v) =>
                        sendRequest(app)
                            .post('/admin/school')
                            .send(v)
                            .set('Authorization', `Bearer ${token}`)
                            .expect(201),
                    ),
                );
                reses.forEach((res) => {
                    expect(res.text).toEqual(MESSAGES.SCHOOL_CREATE_SUCCESS);
                });
            });
        });

        describe('미권한 유저', () => {
            it('요청', async () => {
                const res = await sendRequest(app)
                    .post('/admin/school')
                    .send({ id: v4() })
                    .set('Authorization', `Bearer ${tokens[2]}`)
                    .expect(401);
                expect(res.text).toEqual(MESSAGES.UNAUTHORIZED);
            });
        });

        describe('형식 불량', () => {
            it('이름 누락', async () => {
                const res = await sendRequest(app)
                    .post('/admin/school')
                    .send({
                        local: schoolInput.local,
                    })
                    .set('Authorization', `Bearer ${token}`)
                    .expect(400);
                expect(res.text).toEqual(MESSAGES.BAD_REQUEST);
            });

            it('지역 누락', async () => {
                const res = await sendRequest(app)
                    .post('/admin/school')
                    .send({
                        name: schoolInput.name,
                    })
                    .set('Authorization', `Bearer ${token}`)
                    .expect(400);
                expect(res.text).toEqual(MESSAGES.BAD_REQUEST);
            });

            it('토큰 누락', async () => {
                const res = await sendRequest(app)
                    .post('/admin/school')
                    .send(schoolInput)
                    .expect(401);
                expect(res.text).toEqual(MESSAGES.UNAUTHORIZED);
            });
        });

        describe('중복', () => {
            beforeEach(async () => {
                await sendRequest(app)
                    .post('/admin/school')
                    .send(schoolInput)
                    .set('Authorization', `Bearer ${token}`);
            });

            it('이름 중복', async () => {
                const res = await sendRequest(app)
                    .post('/admin/school')
                    .send(schoolInput)
                    .set('Authorization', `Bearer ${token}`)
                    .expect(409);
                expect(res.text).toEqual(MESSAGES.SCHOOL_OVERLAP);
            });
        });
    });

    ///////////////////////////////////////////////////////////////////
    // 학교 페이지 수정
    describe('PUT /admin/school', () => {
        afterEach(async () => {
            await schoolRepository.clear();
        });

        describe('정상 테스트', () => {
            let id: string;

            beforeEach(async () => {
                // 생성
                await sendRequest(app)
                    .post('/admin/school')
                    .send(schoolInput)
                    .set('Authorization', `Bearer ${token}`);

                // 조회
                const res = await sendRequest(app)
                    .get('/admin/school/my')
                    .set('Authorization', `Bearer ${token}`);

                id = res.body[0].id;
            });

            it('이름, 지역 변경', async () => {
                expect(id).toBeDefined();

                // 수정
                const res = await sendRequest(app)
                    .put('/admin/school')
                    .send({
                        id: id,
                        name: '고래대학교',
                        local: '울산',
                    })
                    .set('Authorization', `Bearer ${token}`)
                    .expect(200);
                expect(res.text).toEqual(MESSAGES.SCHOOL_UPDATE_SUCCESS);

                // 조회
                const getRes = await sendRequest(app)
                    .get('/admin/school/my')
                    .set('Authorization', `Bearer ${token}`)
                    .expect(200);

                // 데이터가 변경되었는지 확인
                expect({
                    name: getRes.body[0].name,
                    local: getRes.body[0].local,
                }).toStrictEqual({ name: '고래대학교', local: '울산' });
            });

            it('이름 변경', async () => {
                expect(id).toBeDefined();

                // 수정
                const res = await sendRequest(app)
                    .put('/admin/school')
                    .send({
                        id: id,
                        name: '고래대학교',
                    })
                    .set('Authorization', `Bearer ${token}`)
                    .expect(200);
                expect(res.text).toEqual(MESSAGES.SCHOOL_UPDATE_SUCCESS);

                // 조회
                const getRes = await sendRequest(app)
                    .get('/admin/school/my')
                    .set('Authorization', `Bearer ${token}`)
                    .expect(200);

                // 데이터가 변경되었는지 확인
                expect({
                    name: getRes.body[0].name,
                    local: getRes.body[0].local,
                }).toStrictEqual({
                    name: '고래대학교',
                    local: schoolInput.local,
                });
            });

            it('지역 변경', async () => {
                expect(id).toBeDefined();

                // 수정
                const res = await sendRequest(app)
                    .put('/admin/school')
                    .send({
                        id: id,
                        local: '울산',
                    })
                    .set('Authorization', `Bearer ${token}`)
                    .expect(200);
                expect(res.text).toEqual(MESSAGES.SCHOOL_UPDATE_SUCCESS);

                // 조회
                const getRes = await sendRequest(app)
                    .get('/admin/school/my')
                    .set('Authorization', `Bearer ${token}`)
                    .expect(200);

                // 데이터가 변경되었는지 확인
                expect({
                    name: getRes.body[0].name,
                    local: getRes.body[0].local,
                }).toStrictEqual({ name: schoolInput.name, local: '울산' });
            });
        });

        describe('미권한 유저', () => {
            it('요청', async () => {
                const res = await sendRequest(app)
                    .put('/admin/school')
                    .send({ id: v4() })
                    .set('Authorization', `Bearer ${tokens[2]}`)
                    .expect(401);
                expect(res.text).toEqual(MESSAGES.UNAUTHORIZED);
            });
        });

        describe('미권한 관리자', () => {
            let id: string;

            beforeEach(async () => {
                // 생성
                await sendRequest(app)
                    .post('/admin/school')
                    .send(schoolInput)
                    .set('Authorization', `Bearer ${token}`);

                // 조회
                const res = await sendRequest(app)
                    .get('/admin/school/my')
                    .set('Authorization', `Bearer ${token}`);

                id = res.body[0].id;
            });

            it('요청', async () => {
                const res = await sendRequest(app)
                    .put('/admin/school')
                    .send({
                        id: id,
                        name: '고래대학교',
                    })
                    .set('Authorization', `Bearer ${tokens[1]}`)
                    .expect(401);
                expect(res.text).toEqual(MESSAGES.UNAUTHORIZED);
            });
        });

        describe('중복', () => {
            let id: string;

            beforeEach(async () => {
                // 생성
                await sendRequest(app)
                    .post('/admin/school')
                    .send(schoolInput)
                    .set('Authorization', `Bearer ${token}`);

                // 조회
                const res = await sendRequest(app)
                    .get('/admin/school/my')
                    .set('Authorization', `Bearer ${token}`);

                id = res.body[0].id;
            });

            it('이름 중복', async () => {
                const res = await sendRequest(app)
                    .put('/admin/school')
                    .send({
                        id: id,
                        name: schoolInput.name,
                        local: '제주',
                    })
                    .set('Authorization', `Bearer ${token}`)
                    .expect(409);
                expect(res.text).toEqual(MESSAGES.SCHOOL_OVERLAP);
            });
        });

        describe('형식 불량', () => {
            it('UUID 미입력', async () => {
                const res = await sendRequest(app)
                    .put('/admin/school')
                    .send({ id: '' })
                    .set('Authorization', `Bearer ${token}`)
                    .expect(400);
                expect(res.text).toEqual(MESSAGES.BAD_REQUEST);
            });

            it('이상한 UUID 입력', async () => {
                const res = await sendRequest(app)
                    .put('/admin/school')
                    .send({ id: v4() })
                    .set('Authorization', `Bearer ${token}`)
                    .expect(409);
                expect(res.text).toEqual(MESSAGES.SCHOOL_UNVALID);
            });

            it('토큰 누락', async () => {
                const res = await sendRequest(app)
                    .put('/admin/school')
                    .send({ id: v4() })
                    .expect(401);
                expect(res.text).toEqual(MESSAGES.UNAUTHORIZED);
            });
        });
    });

    ///////////////////////////////////////////////////////////////////
    // 학교 페이지 삭제
    describe('DELETE /admin/school', () => {
        afterEach(async () => {
            await schoolRepository.clear();
        });

        describe('정상 테스트', () => {
            let ids: Array<string>;

            beforeEach(async () => {
                // 생성
                await Promise.all(
                    schoolInputs.map((v) =>
                        sendRequest(app)
                            .post('/admin/school')
                            .send(v)
                            .set('Authorization', `Bearer ${token}`),
                    ),
                );

                // 조회
                const res = await sendRequest(app)
                    .get('/admin/school/my')
                    .set('Authorization', `Bearer ${token}`);

                ids = res.body.map((v: SchoolEntity) => v.id);
            });

            it('삭제', async () => {
                expect(ids).toBeDefined();

                // 삭제
                const res = await sendRequest(app)
                    .delete('/admin/school')
                    .send({ id: ids[0] })
                    .set('Authorization', `Bearer ${token}`)
                    .expect(200);
                expect(res.text).toEqual(MESSAGES.SCHOOL_DELETE_SUCCESS);

                // 조회
                const getRes = await sendRequest(app)
                    .get('/admin/school/my')
                    .set('Authorization', `Bearer ${token}`)
                    .expect(200);
                expect(getRes.body).toBeDefined();
                expect(getRes.body).toBeInstanceOf(Array);
                expect(getRes.body.length).toEqual(schoolInputs.length - 1);
            });
        });

        describe('미권한 유저', () => {
            it('요청', async () => {
                const res = await sendRequest(app)
                    .delete('/admin/school')
                    .send({ id: v4() })
                    .set('Authorization', `Bearer ${tokens[2]}`)
                    .expect(401);
                expect(res.text).toEqual(MESSAGES.UNAUTHORIZED);
            });
        });

        describe('미권한 관리자', () => {
            let id: string;

            beforeEach(async () => {
                // 생성
                await sendRequest(app)
                    .post('/admin/school')
                    .send(schoolInput)
                    .set('Authorization', `Bearer ${token}`);

                // 조회
                const res = await sendRequest(app)
                    .get('/admin/school/my')
                    .set('Authorization', `Bearer ${token}`);

                id = res.body[0].id;
            });

            it('요청', async () => {
                // 수정
                const res = await sendRequest(app)
                    .delete('/admin/school')
                    .send({ id: id })
                    .set('Authorization', `Bearer ${tokens[1]}`)
                    .expect(401);
                expect(res.text).toEqual(MESSAGES.UNAUTHORIZED);
            });
        });

        describe('형식 불량', () => {
            it('UUID 미입력', async () => {
                const res = await sendRequest(app)
                    .delete('/admin/school')
                    .send()
                    .set('Authorization', `Bearer ${token}`)
                    .expect(400);
                expect(res.text).toEqual(MESSAGES.BAD_REQUEST);
            });

            it('이상한 UUID 입력', async () => {
                const res = await sendRequest(app)
                    .delete('/admin/school')
                    .send({ id: v4() })
                    .set('Authorization', `Bearer ${token}`)
                    .expect(409);
                expect(res.text).toEqual(MESSAGES.SCHOOL_UNVALID);
            });

            it('토큰 누락', async () => {
                const res = await sendRequest(app)
                    .delete('/admin/school')
                    .send({ id: v4() })
                    .expect(401);
                expect(res.text).toEqual(MESSAGES.UNAUTHORIZED);
            });
        });
    });
});
