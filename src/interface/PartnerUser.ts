interface City {
    id: number;
    name: string;
}

interface PartnerLocation {
    id: number;
    name: string;
    city: City;
}

export interface UserPartnerLocation {
    partner_location: PartnerLocation;
}

export interface UserRole {
    userId: number;
    roleId: number;
    status: string;
}

interface UserPartner {
    userId: number;
    partnerId: number;
    status: string;
    allowAllLocations: boolean;
}

export interface User {
    id: number;
    name: string;
    email: string;
    imageUrl: string | null;
    status: string;
    uuid: string;
    phoneNumber: string | null;
    user_partner_locations: UserPartnerLocation[];
    user_roles: UserRole[];
    user_partners: UserPartner[];
}

interface UserData {
    response: {
        pages: number;
        count: number;
        currentPage: number;
        pageSize: number;
        results: User[];
    };
}

export interface PartnerUsersApiResponse {
    success: boolean;
    data: UserData;
    message: string[];
    error: null;
}

interface UserResponse {
    user: User;
}

export interface PartnerUserDetailsApiResponse {
    success: boolean;
    data: UserResponse;
    message: string[];
    error: null;
}