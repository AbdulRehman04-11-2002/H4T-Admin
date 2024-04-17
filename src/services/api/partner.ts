import { GetPartnersApiResponse, PartnerApiResponse } from "../../interface/Partner";
import { PartnerUsersApiResponse } from "../../interface/PartnerUser";
import { api } from "./Index";


export const getPartners = async (
    page: number,
    pageSize: number,
    searchString: string,
    status: string
) => {
    const params = {
        ...(page ? { page: page } : {}),
        ...(pageSize ? { pageSize: pageSize } : {}),
        ...(searchString ? { searchString: searchString } : {}),
        ...(status === "ALL" ? {} : status ? { status: status } : {}),
    };

    const response = await api.get<GetPartnersApiResponse>("/partner/", {
        params,
    });
    return response.data;
};

export const getPartner = async (id: string) => {
    const response = await api.get<PartnerApiResponse>(`/partner/${id}`);
    return response.data;
};

export const createPartner = async (data: any) => {
    const response = await api.post<PartnerApiResponse>("/partner/", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const updatePartner = async (id: string, data: any) => {
    const response = await api.patch<PartnerApiResponse>(`/partner/${id}`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

// partnerUser
export const getPartnerUsers = async (
    page: number,
    pageSize: number,
    searchString: string,
    status: string,
    partnerId: string
) => {
    const params = {
        ...(page ? { page: page } : {}),
        ...(pageSize ? { pageSize: pageSize } : {}),
        ...(searchString ? { searchString: searchString } : {}),
        ...(status === "ALL" ? {} : status ? { status: status } : {}),
        ...(partnerId ? { partnerId: partnerId } : {}),
    };

    const response = await api.get<PartnerUsersApiResponse>("/partnerUser/", {
        params,
    });
    return response.data;
};
