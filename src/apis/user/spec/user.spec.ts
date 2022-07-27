import { Test } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { ConflictException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

import { MESSAGES } from '../../../commons/message/message.enum';
import { UserClassEntity } from '../../userClass/entities/userClass.entity';
import { UserClassRepository } from '../../userClass/entities/userClass.repository';
import { UserClassMockRepository } from '../../userClass/spec/userClass.mock.repository';

import { UserEntity } from '../entities/user.entity';
import { UserRepository } from '../entities/user.repository';

import { UserService } from '../user.service';
import { UserMockRepository } from './user.mock.repository';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('User service', () => {
    let mockUserRepo: MockRepository<UserEntity>;
    let mockUserClassRepo: MockRepository<UserClassEntity>;

    let userService: UserService;
    let userRepository: UserRepository;
    let userClassRepository: UserClassRepository;

    beforeAll(async () => {
        const modules = await Test.createTestingModule({
            providers: [
                UserService,
                UserRepository,
                UserClassRepository,
                {
                    provide: getRepositoryToken(UserEntity),
                    useValue: UserMockRepository(),
                },
                {
                    provide: getRepositoryToken(UserClassEntity),
                    useValue: UserClassMockRepository(),
                },
            ],
        }).compile();

        userService = modules.get(UserService);
        userRepository = modules.get(UserRepository);
        userClassRepository = modules.get(UserClassRepository);
        mockUserRepo = modules.get(getRepositoryToken(UserEntity));
        mockUserClassRepo = modules.get(getRepositoryToken(UserClassEntity));
    });

    it('be defined', () => {
        expect(userService).toBeDefined();
        expect(userRepository).toBeDefined();
        expect(userClassRepository).toBeDefined();
        expect(mockUserRepo).toBeDefined();
        expect(mockUserClassRepo).toBeDefined();
    });

    describe('회원가입', () => {
        const info = {
            name: '김회민',
            nickName: '고래잡는새우',
            email: 'ksk7584@gmail.com',
            pwd: 'qwer1234!',
        };

        beforeEach(() => {
            mockUserRepo.createQueryBuilder().getOne.mockReturnValue(undefined);
        });

        it('단일 가입', async () => {
            expect(mockUserRepo.createQueryBuilder().getOne()).toBeUndefined();

            const user = await userService.create(info);
            expect(user).not.toBeUndefined();
            expect(user.name).toEqual(info.name);
            expect(user.nickName).toEqual(info.nickName);
            expect(user.email).toEqual(info.email);
            expect(user.pwd).not.toEqual(info.pwd);
        });

        it('동일한 이메일로 가입', async () => {
            expect(mockUserRepo.createQueryBuilder().getOne()).toBeUndefined();

            const user = await userService.create(info);
            mockUserRepo.createQueryBuilder().getOne.mockReturnValue(user);
            expect(
                mockUserRepo.createQueryBuilder().getOne(),
            ).not.toBeUndefined();

            try {
                await userService.create(info);
            } catch (e) {
                expect(e).toBeInstanceOf(ConflictException);
                expect(e.message).toBe(MESSAGES.USER_OVERLAP);
            }
        });
    });
});
