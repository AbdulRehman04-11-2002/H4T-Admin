import { api } from "./Index";
import { PartnerProductsApiGetResponse, PartnerProductsApiResponse } from "../../interface/PartnerProduct";



export const getPartnerProducts = async (
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

    const response = await api.get<PartnerProductsApiResponse>("/partnerProduct", {
        params,
    });
    return response.data;
};



export const getProducts = async (id: string) => {
    const response = await api.get<PartnerProductsApiGetResponse>(`/partnerProduct/${id}`);
    return response.data;
}

export const createPartnerProduct = async (data: any) => {
    const response = await api.post<PartnerProductsApiGetResponse>("/partnerProduct/", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const updatePartnerProduct = async (id: string, data: any) => {
    const response = await api.patch<PartnerProductsApiGetResponse>(`/partnerProduct/${id}`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};