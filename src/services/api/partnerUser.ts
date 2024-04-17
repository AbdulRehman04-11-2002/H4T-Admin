import { PartnerUserDetailsApiResponse } from "../../interface/PartnerUser";
import { api } from "./Index";


export const getPartnerUser = async (id: string) => {
    const response = await api.get<PartnerUserDetailsApiResponse>(`/partnerUser/${id}`);
    return response.data;
};

export const createPartnerUser = async (data: any) => {
    const response = await api.post<PartnerUserDetailsApiResponse>("/partnerUser/", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const updatePartnerUser = async (id: string, data: any) => {
    const response = await api.patch<PartnerUserDetailsApiResponse>(`/partnerUser/${id}`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};