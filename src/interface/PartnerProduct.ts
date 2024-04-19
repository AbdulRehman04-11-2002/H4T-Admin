import { PartnerLocation } from "./PartnerLocation";

interface PartnerService {
    id: number;
    feeValue: number;
    feeType: string;
    status: string;
    partnerId: number;
    serviceId: number;
}

export interface PartnerProduct {
    id: number;
    name: string;
    code: string | null;
    imageUrl: string | null;
    price: number;
    slotDuration: number;
    description: string | null;
    guidelines: string | null;
    allowAllLocations: boolean | null;
    status: string;
    partnerId: number;
    partnerServiceId: number;
    partner_service: PartnerService;
    partner_product_locations: PartnerProductLocation[];
    partner_product_tags: any[];
}

interface PartnerProductsResponse {
    pages: number;
    count: number;
    currentPage: number;
    pageSize: number;
    results: PartnerProduct[];
}

interface PartnerProductLocation {
    product: number;
    location: number;
    status: string;
    partner_location: PartnerLocation;
}

interface PartnerProductResponse {
    partnerProducts: PartnerProductsResponse;
}

export interface PartnerProductsApiResponse {
    success: boolean;
    data: PartnerProductResponse;
    message: string[];
    error: any;
}

interface PartnerProductGetResponse {
    partnerProduct: PartnerProduct;
}

export interface PartnerProductsApiGetResponse {
    success: boolean;
    data: PartnerProductGetResponse;
    message: string[];
    error: any;
}