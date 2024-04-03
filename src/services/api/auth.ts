import { api } from "./Index";

export const login = async (data: any) => {
    const response = await api.post<any>("/admin/auth/login", data);
    return response.data;
};

export const verifyCode = async (data: any) => {
    const response = await api.post<any>("/auth/verify", data);
    return response.data;
};

export const refreshToken = async (data: any) => {
    const response = await api.post<any>("/auth/refresh", data);
    return response.data;
};

export const fetchCurrentUser = async () => {
    const response = await api.get<any>("/me");
    return response.data;
};
