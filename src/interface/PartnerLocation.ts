interface City {
    id: number;
    name: string;
    shortName: string;
    type: string;
    status: string;
    location: any; // You can define a more specific type for location if needed
}


interface PartnerLocationResponse {
    pages: number;
    count: number;
    currentPage: number;
    pageSize: number;
    results: PartnerLocation[];
}

export interface PartnerLocationsApiResponse {
    success: boolean;
    data: {
        response: PartnerLocationResponse;
    };
    message: string[];
    error: any;
}

interface PartnerLocationTiming {
    location: number;
    day: string;
    startTime: string;
    endTime: string;
    breakStart: string;
    breakEnd: string;
    status: string;
}

export interface PartnerLocation {
    id: number;
    name: string;
    code: string;
    phoneNumber: string;
    postalCode: string;
    longitude: string;
    lattitude: string;
    streetAddress: string;
    customerGuidelines: string;
    imageUrl: string | null;
    status: string;
    cityId: number;
    partnerId: number;
    city: City;
    partner_location_timings: PartnerLocationTiming[];
}

interface PartnerLocationResponse {
    response: PartnerLocation;
}

export interface PartnerLocationGetApiResponse {
    success: boolean;
    data: PartnerLocationResponse;
    message: string[];
    error: any;
}