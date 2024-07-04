
export interface Booking {
    id: number;
    code: string;
    name: string;
    paymentStatus: string;
    status: string;
    order_items: OrderItem[];
}

interface OrdersListResponse {
    pages: number;
    count: number;
    currentPage: number;
    pageSize: number;
    results: Booking[];
}

interface PrismaError {
    name: string;
    code: string;
    clientVersion: string;
    meta: {
        modelName: string;
        field_name: string;
    };
}

export interface GetOrderItemsApiResponse {
    success: boolean;
    data: {
        orders: OrdersListResponse;
    };
    message: string[];
    error: PrismaError | null;
}

interface INewService {
    name?: string;
    amount: number;
}

export type NewService = INewService | null

interface IOrderItem {
    id: number;
    orderId?: number;
    code?: string;
    visitorFullName?: string;
    visitorFirstName?: string;
    visitorLastName?: string;
    other_services: NewService[];
    serviceDuration?: number;
    serviceDateTime?: string;
    status?: string;
    productName?: string;
    productPrice?: number;
    partnerLocation?: { name: string, timeZone: string };
    totalPaidServicesAmount?: number;
}

export type OrderItem = IOrderItem | null

export interface Order {
    id: number;
    code?: string;
    billingPersonContactNumber?: string;
    billingPersonEmail?: string;
    totalPaidServicesAmount?: number;
    paymentStatus?: string;
    orderStatus?: string;
    order_items: OrderItem[];
}