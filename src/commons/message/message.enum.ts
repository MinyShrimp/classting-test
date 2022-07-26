export const MESSAGES = {
    ///////////////////////////////////////////////////////////////////
    // GENERALs //
    UNAUTHORIZED: 'Unauthorized',
    UNVALID_ACCESS: '잘못된 접근입니다.',
    UNKNOWN_FAILED: '알 수 없는 이유로 실패했습니다.',

    ///////////////////////////////////////////////////////////////////
    // 학교 페이지 //
    SCHOOL_UNVALID: '학교 정보를 찾을 수 없습니다.',
    SCHOOL_OVERLAP: '이미 존재하는 학교입니다.',

    SCHOOL_CREATE_SUCCESS: '생성되었습니다.',
    SCHOOL_UPDATE_SUCCESS: '수정되었습니다.',
    SCHOOL_DELETE_SUCCESS: '삭제되었습니다.',

    ///////////////////////////////////////////////////////////////////
    // 학교 소식 //
    NEWS_UNVALID: '소식 정보가 없습니다.',

    NEWS_CREATE_SUCCESS: '생성되었습니다.',
    NEWS_UPDATE_SUCCESS: '수정되었습니다.',
    NEWS_DELETE_SUCCESS: '삭제되었습니다.',
    NEWS_RESTORE_SUCCESS: '삭제 취소가 완료되었습니다.',

    ///////////////////////////////////////////////////////////////////
    // 구독 //
    SUBSCRIBE_UNVALID: '구독 정보를 찾을 수 없습니다.',
    SUBSCRIBE_OVERLAP: '이미 구독이 되어있습니다.',
    SUBSCRIBE_AUTH: '해당 학교 관리자는 구독을 할 수 없습니다.',

    SUBSCRIBE_CREATE_SUCCESS: '구독했습니다.',
    SUBSCRIBE_CANCLE_SUCCESS: '구독을 취소했습니다.',

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
