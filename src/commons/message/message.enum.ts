export const MESSAGES = {
    ///////////////////////////////////////////////////////////////////
    // GENERALs //
    UNAUTHORIZED: 'Unauthorized',
    UNVALID_ACCESS: '잘못된 접근입니다.',

    ///////////////////////////////////////////////////////////////////
    // 학교 페이지 //
    SCHOOL_UNVALID: '학교 정보를 찾을 수 없습니다.',
    SCHOOL_OVERLAP: '이미 존재하는 학교입니다.',

    SCHOOL_CREATE_SUCCESS: '학교 페이지 생성에 성공했습니다.',
    SCHOOL_UPDATE_SUCCESS: '수정을 완료했습니다.',
    SCHOOL_UPDATE_FAILED: '수정을 실패했습니다.',
    SCHOOL_DELETE_SUCCESS: '삭제를 완료했습니다.',
    SCHOOL_DELETE_FAILED: '삭제를 실패했습니다.',

    ///////////////////////////////////////////////////////////////////
    // 회원 //
    USER_UNVALID: '회원 정보가 없습니다.',
    USER_OVERLAP: '이메일이나 닉네임이 중복되었습니다.',

    USER_PASSWORD_UNVALID: '패스워드가 일치하지 않습니다.',

    LOGOUT_SUCCESS: '로그아웃이 완료되었습니다.',
    LOGOUT_FAILED: '로그아웃을 실패했습니다.',

    SIGNUP_SUCCESS: '회원 가입이 완료되었습니다.',
} as const;

export type MESSAGES = typeof MESSAGES[keyof typeof MESSAGES];
