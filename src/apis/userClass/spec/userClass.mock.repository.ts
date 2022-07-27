import { USER_CLASS_ENUM } from '../type/userClass.type';

export const UserClassMockRepository = () => ({
    findOne: jest.fn((dto: { id: string }) => ({
        id: dto.id,
        description: USER_CLASS_ENUM[dto.id],
    })),
});
