# 클러스팅 사전 테스트

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

-   [ ] 단위 테스트 또는 통합 테스트를 구현해주세요.

### 문서화

-   [ ] 구현에 맞는 API 명세를 문서화해주세요.

    -   [ ] Swagger

## 스택

NestJS, Docker, TypeORM, MySQL

## 산출물

|          |                                              |
| -------- | -------------------------------------------- |
| 깃헙     | https://github.com/MinyShrimp/classting-test |
| ERDCloud | https://www.erdcloud.com/d/3KR8RFx3vKekF4Lk4 |
|          |                                              |

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

#### 구독 CRUD API 구현

|        |                             |                          |
| ------ | --------------------------- | ------------------------ |
| GET    | /api/subscribe/list         | 구독 중인 학교 목록 조회 |
| GET    | /api/subscribe/news/:school | 학교별 소식 조회         |
| POST   | /api/subscribe              | 구독                     |
| DELETE | /api/subscribe              | 구독 취소                |
