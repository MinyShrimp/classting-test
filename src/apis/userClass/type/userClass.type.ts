export const USER_CLASS_ENUM = {
    USER: '일반 유저',
    ADMIN: '관리자',
};
export type USER_CLASS_TYPE =
    typeof USER_CLASS_ENUM[keyof typeof USER_CLASS_ENUM];
