interface __Payload {
    email: string;
    nickName: string;
    isAdmin?: boolean;
}

export interface IPayload extends __Payload {
    id: string;
}

export interface IPayloadSub extends __Payload {
    sub: string;
}
