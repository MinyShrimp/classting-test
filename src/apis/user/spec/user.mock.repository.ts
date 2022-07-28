import { v4 } from 'uuid';

import { createQueryBuilder } from '../../../commons/test/createQueryBuilder.mock';

import { UserEntity } from '../entities/user.entity';

export const UserMockRepository = () => {
    return {
        update: jest.fn(
            (
                dto: { id: string },
                entity: Partial<UserEntity>, //
            ) => {
                console.log(dto);
                console.log(entity);
            },
        ),
        save: jest.fn(
            (
                entity: Pick<
                    UserEntity,
                    'name' | 'nickName' | 'email' | 'pwd' | 'userClass'
                >,
            ): UserEntity => {
                return {
                    ...entity,
                    id: v4(),
                    isLogin: false,
                    loginAt: null,
                    logoutAt: null,
                    userClassID: entity.userClass.id,
                    createAt: new Date(),
                    updateAt: new Date(),
                    deleteAt: null,
                };
            },
        ),
        createQueryBuilder,
    };
};
