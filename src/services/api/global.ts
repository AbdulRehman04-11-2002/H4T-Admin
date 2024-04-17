import { api } from "./Index";

export const getME = async (
    status: string
) => {
    const params = {
        ...(status === "ALL" ? {} : status ? { status: status } : {}),
    };
    const response = await api.get<any>("/global/me", {
        params,
    });
    return response.data;
};