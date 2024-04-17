import { InternalNamePath } from "../type/login.type";

export interface ValidateErrorEntity<Values = any> {
    values: Values;
    errorFields: {
        name: InternalNamePath;
        errors: string[];
    }[];
    outOfDate: boolean;
}

export interface LoginProps {
    setToken?: any
}

export interface LoginResponse {
    success: boolean;
    data: {
        session: string;
        user_id: string;
    };
    message: string[];
    error: null;
}

export interface VerifyOTPResponse {
    success: boolean;
    data: {
        AccessToken: string;
        ExpiresIn: number;
        TokenType: string;
        RefreshToken: string;
        IdToken: string;
    };
    message: string[];
    error?: {
        code: number;
        messages: (string | { Session: string })[];
    }[];
}