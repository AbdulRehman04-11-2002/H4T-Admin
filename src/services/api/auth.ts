import { LoginResponse, VerifyOTPResponse } from "../../interface/Login";
import { RefreshTokenResponse, LogoutResponse } from "../../interface/Request";
import { api } from "./Index";

export const login = async (data: any) => {
    const response = await api.post<LoginResponse>("/auth/login", data);
    return response.data;
};

export const verifyCode = async (data: any) => {
    const response = await api.post<VerifyOTPResponse>("/auth/verifyCode", data);
    return response.data;
};

export const refreshToken = async (data: any) => {
    const response = await api.post<RefreshTokenResponse>("/auth/refreshToken/", data);
    return response.data;
};

export const fetchCurrentUser = async () => {
    const response = await api.get<any>("/me");
    return response.data;
};

export const logout = async (data: any) => {
    const response = await api.post<LogoutResponse>("/auth/logout/", data);
    return response.data;
};

