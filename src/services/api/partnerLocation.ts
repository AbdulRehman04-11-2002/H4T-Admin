import { api } from "./Index";
import { AllPartnerLocationsApiResponse, PartnerLocationGetApiResponse, PartnerLocationsApiResponse } from "../../interface/PartnerLocation";



export const getPartnerLocations = async (
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

    const response = await api.get<PartnerLocationsApiResponse>("/partnerLocation", {
        params,
    });
    return response.data;
};

export const getAllPartnerLocations = async () => {
    const params = {
        status: "ENABLED",
    };

    const response = await api.get<AllPartnerLocationsApiResponse>("/partnerLocation/admin", { params });
    return response.data;
};

export const getLocation = async (id: string) => {
    const response = await api.get<PartnerLocationGetApiResponse>(`/partnerLocation/${id}`);
    return response.data;
}

export const createPartnerLocation = async (data: any) => {
    const response = await api.post<PartnerLocationGetApiResponse>("/partnerLocation/", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const updatePartnerLocation = async (id: string, data: any) => {
    const response = await api.patch<PartnerLocationGetApiResponse>(`/partnerLocation/${id}`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};