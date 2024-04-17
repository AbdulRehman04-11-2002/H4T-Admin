export interface RegisteredCity {
    id: number;
    name: string;
    shortName: string;
    type: string;
    status: string;
    location: number;
}

export interface Service {
    id: number;
    feeType: string;
    feeValue: number;
    service: {
        id: number;
        name: string;
    };
}

export interface Partner {
    id: number;
    name: string;
    businessId: string;
    imageUrl: string;
    licenseNumber: string;
    contractNumber: string;
    registeredStreetAddress: string;
    registeredPostalCode: string;
    contactPerson: string;
    phoneNumber: string;
    emailAddress: string;
    status: string;
    registeredCityId: number;
    currencyId: number;
    registeredCity: RegisteredCity;
    services: Service[];
}

export interface PartnerApiResponse {
    success: boolean;
    data: PartnerResponse;
    message: string;
    error: {
        code: number;
        messages: (string | {
            name: string;
            code: string;
            clientVersion: string;
            meta: {
                modelName: string;
                field_name: string;
            };
        })[];
    }[];
}

interface PartnerResponse {
    partner: Partner;
}



interface PartnersListResponse {
    pages: number;
    count: number;
    currentPage: number;
    pageSize: number;
    results: Partner[];
}

export interface GetPartnersApiResponse {
    success: boolean;
    data: {
        response: PartnersListResponse;
    };
    message: string[];
    error: PrismaError | null;
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