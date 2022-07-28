# 클러스팅 사전 테스트

![swagger](https://user-images.githubusercontent.com/41733172/181095949-c7fac147-61f0-4c6a-aec9-9611d6170b5d.png)

![test](https://user-images.githubusercontent.com/41733172/181508948-84c9dcad-8a6c-42cb-8836-34389dc6c970.png)

## 기간

2022-07-26(화) ~ 2022-08-02(화)

## 요구 사항

### 필수 구현

-   [x] 학교 관리자는 학교를 페이지를 운영하여 학교 소식을 발행할 수 있다.

    -   [x] 학교 관리자는 지역, 학교명으로 학교 페이지를 생성할 수 있다.
    -   [x] 학교 관리자는 학교 페이지 내에 소식을 작성할 수 있다.
    -   [x] 학교 관리자는 작성된 소식을 삭제할 수 있다.
    -   [x] 학교 관리자는 작성된 소식을 수정할 수 있다.

-   [x] 학생은 학교 페이지를 구독하여 학교 소식을 받아 볼 수 있다.

    -   [x] 학생은 학교 페이지를 구독할 수 있다.
    -   [x] 학생은 구독 중인 학교 페이지 목록을 확인할 수 있다.
    -   [x] 학생은 구독 중인 학교 페이지를 구독 취소할 수 있다.
    -   [x] 학생은 구독 중인 학교 페이지별 소식을 볼 수 있다.
        -   학교별 소식은 최신순으로 노출해야함

### 추가 구현

-   [x] 학생은 구독 중인 학교 소식을 자신의 뉴스피드에서 모아볼 수 있다.

    -   [x] 구독중인 모든 학교의 소식을 모아볼 수 있어야함
    -   [x] 학교 소식이 노출되는 뉴스피드는 최신순으로 소식을 노출
    -   [x] 학교페이지를 구독하는 시점 이후 소식부터 뉴스피드를 받음
    -   [x] 학교 페이지 구독을 취소해도 기존 뉴스피드에 나타난 소식은 유지해야 함.

### 테스트

-   [x] 단위 테스트 또는 통합 테스트를 구현해주세요.

### 문서화

-   [x] 구현에 맞는 API 명세를 문서화해주세요.

    -   [x] Swagger
    -   [x] README

## 스택

NestJS, Docker, TypeORM, MySQL

## 산출물

|          |                                              |
| -------- | -------------------------------------------- |
| 깃헙     | https://github.com/MinyShrimp/classting-test |
| ERDCloud | https://www.erdcloud.com/d/3KR8RFx3vKekF4Lk4 |

## 진행도

### 2022-07-26

#### erd 작성 ( ERD Cloud )

#### 보일러 플로이트 작성

-   exception filter
-   swagger
-   jwt, passport
-   typeorm
-   docker, docker-compose

#### 유저 회원가입, 로그인, 로그아웃, RestoreToken API 구현 ( JWT 기반 )

|      |               |             |
| ---- | ------------- | ----------- |
| POST | /auth/signup  | 회원가입    |
| POST | /auth/login   | 로그인      |
| POST | /auth/logout  | 로그아웃    |
| POST | /auth/restore | 토큰 재발급 |

#### 학교 페이지 CRUD API 구현

|        |                  |                                   |
| ------ | ---------------- | --------------------------------- |
| GET    | /admin/school/my | 자기가 만든 학교 페이지 목록 조회 |
| POST   | /admin/school    | 새로운 학교 페이지 생성           |
| PUT    | /admin/school    | 학교 페이지 정보 수정             |
| DELETE | /admin/school    | 학교 페이지 삭제                  |

#### 학교 소식 CUD API 구현

|        |                    |                       |
| ------ | ------------------ | --------------------- |
| POST   | /admin/school/news | 새로운 학교 소식 생성 |
| PUT    | /admin/school/news | 학교 소식 수정        |
| PATCH  | /admin/school/news | 학교 소식 삭제 취소   |
| DELETE | /admin/school/news | 학교 소식 삭제        |

### 2022-07-27

#### 구독 CRD API 구현

|        |                             |                          |
| ------ | --------------------------- | ------------------------ |
| GET    | /api/subscribe/list         | 구독 중인 학교 목록 조회 |
| GET    | /api/subscribe/news/:school | 학교별 소식 조회         |
| POST   | /api/subscribe              | 구독                     |
| DELETE | /api/subscribe              | 구독 취소                |

#### 뉴스피드 API 구현

|     |               |                   |
| --- | ------------- | ----------------- |
| GET | /api/newsfeed | 뉴스피드 조회 API |

#### 회원 테스트 구현

-   POST /api/signup 회원가입
    -   정상 테스트
    -   형식 불량
        -   이메일
        -   비밀번호
        -   이름
        -   닉네임
    -   중복
        -   이메일
        -   닉네임

#### 인증 테스트 구현

-   POST /auth/login 로그인
    -   정상 테스트
    -   오류
        -   존재하지 않는 계정 ( 이메일 )
        -   다른 비밀번호 입력
    -   형식 불량
        -   이메일
        -   비밀번호
-   POST /auth/logout 로그아웃
    -   정상 테스트
    -   토큰 누락
-   POST /auth/restore 토큰 재발급
    -   정상 테스트
    -   토큰 누락

### 2022-07-28

#### 학교 페이지 테스트 구현

-   GET /admin/school/my
    -   정상 테스트
        -   빈 값
        -   생성한 학교 페이지 목록
    -   미권한 유저
    -   형식 불량
        -   토큰 누락
-   POST /admin/school
    -   정상 테스트
        -   단일 생성
        -   다중 생성
    -   미권한 유저
    -   형식 불량
        -   이름 누락
        -   지역 누락
        -   토큰 누락
    -   중복
        -   이름 중복
-   PUT /admin/school
    -   정상 테스트
        -   이름, 지역 변경
        -   이름 변경
        -   지역 변경
    -   미권한 유저
    -   미권한 관리자
    -   중복
        -   이름 중복
    -   형식 불량
        -   UUID 미입력
        -   이상한 UUID 입력
        -   토큰 누락
-   DELETE /admin/school
    -   정상 테스트
        -   삭제
    -   미권한 유저
    -   미권한 관리자
    -   형식 불량
        -   UUID 미입력
        -   이상한 UUID 입력
        -   토큰 누락

#### 학교 구독 테스트 구현

-   GET /api/subscribe/list
    -   정상 테스트
        -   빈 값
        -   0, 1번 째 학교
        -   2, 3번 째 학교
    -   형식 불량
        -   토큰 누락
-   GET /api/subscribe/news/:school
    -   정상 테스트
        -   빈 값
        -   0 ~ 4번 째 소식
    -   형식 불량
        -   토큰 누락
        -   Param 누락
        -   잘못된 Param
-   POST /api/subscribe
    -   정상 테스트
    -   중복
        -   동일한 관리자
        -   동일한 사람이 동일한 학교에 두 번 요청함
    -   형식 불량
        -   토큰 누락
        -   UUID 누락
        -   이상한 UUID 입력
-   DELETE /api/subscribe
    -   정상 테스트
    -   형식 불량
        -   토큰 누락
        -   UUID 미입력
        -   이상한 UUID 입력

#### 학교 소식 테스트 구현

-   POST /admin/school/news
    -   정상 테스트
        -   요청
    -   미권한
        -   유저
        -   관리자
    -   형식 불량
        -   토큰 누락
        -   UUID 누락
        -   제목 누락
        -   내용 누락
        -   이상한 UUID 입력
-   PUT /admin/school/news
    -   정상 테스트
        -   제목 수정
        -   내용 수정
        -   제목, 내용 수정
    -   미권한
        -   유저
        -   관리자
    -   형식 불량
        -   토큰 누락
        -   UUID 누락
        -   이상한 UUID 입력
-   PATCH /admin/school/news
    -   정상 테스트
        -   삭제 취소
    -   미권한
        -   유저
        -   관리자
    -   형식 불량
        -   토큰 누락
        -   UUID 누락
        -   이상한 UUID 입력
-   DELETE /admin/school/news
    -   정상 테스트
        -   삭제
    -   미권한
        -   유저
        -   관리자
    -   형식 불량
        -   토큰 누락
        -   UUID 누락
        -   이상한 UUID 입력

#### 뉴스피드 테스트 구현

-   GET /api/newsfeed
    -   정상 테스트
        -   빈 값
        -   일반 요청
        -   구독 해제 후 요청
        -   구독 해제 후 관리자가 게시글을 업로드한 뒤 요청
        -   구독 해제 후 관리자가 게시글을 업로드한 후 다시 구독한 후 요청
    -   형식 불량
        -   토큰 누락
