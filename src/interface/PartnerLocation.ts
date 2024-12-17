interface City {
    id: number;
    name: string;
    shortName: string;
    type: string;
    status: string;
    location: any; // You can define a more specific type for location if needed
}

export interface Location {
    id: number;
    name: string;
}

interface PartnerLocationResponse {
    pages: number;
    count: number;
    currentPage: number;
    pageSize: number;
    results: PartnerLocation[];
}

export interface AllPartnerLocationsApiResponse {
    success: boolean;
    data: {
        partnerLocations: Location[];
    };
    message: string[];
    error: any;
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
    walkInGuidelines: string;
    imageUrl: string | null;
    status: string;
    cityId: number;
    partnerId: number;
    city: City;
    partner_location_timings: PartnerLocationTiming[];
    isAvailableNow: boolean;
    isBookingNoticeEnabled: boolean;
    emailAddress: string;
    bookingNoticeMinutes: number;
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