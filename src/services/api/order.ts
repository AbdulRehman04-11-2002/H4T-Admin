import { GetOrderItemsApiResponse, OrderDetailApiResponse } from "../../interface/Order";
import { api } from "./Index";

export const getOrderItems = async (
    page: number,
    pageSize: number,
    searchString: string,
    partnerLocationId: number | undefined,
    startDate: string | null,
    endDate: string | null,
    orderBy: string,
    planningTab: string,
) => {
    const params = {
        ...(page ? { page: page } : {}),
        ...(pageSize ? { pageSize: pageSize } : {}),
        ...(searchString ? { searchString: searchString } : {}),
        ...(partnerLocationId ? { partnerLocationId: partnerLocationId } : {}),
        ...(startDate ? { startDate: startDate } : {}),
        ...(endDate ? { endDate: endDate } : {}),
        ...(orderBy ? { orderBy: orderBy } : {}),
        ...(planningTab ? { planningTab: planningTab } : {}),
    };
    const response = await api.get<GetOrderItemsApiResponse>("/order/orderItems", {
        params,
    });
    return response.data;
};

export const getOrderDetail = async (id: string) => {
    const response = await api.get<OrderDetailApiResponse>(`/order/${id}`);
    return response.data;
};