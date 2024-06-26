
export const MENULABEL = {
    PARTNER: "partner",
    DASHBOARD: "dashboard",

};

export const ERRORS = {
    NAME: "Please enter name",
    BUSINESS_ID: "Please enter business id",
    LICENSE_NUMBER: "Please enter license number",
    STATUS: "Please enter status",
    UPLOAD_LOGO: "Please upload logo",
    CONTACT_NUMBER: "Please enter contact number",
    SEARCH_AND_SELECT_CITY: "Please search and select city",
    STREET_ADDRESS: "Please enter street address",
    POSTAL_CODE: "Please enter postal code",
    POSTAL_CODE_VALID: "Please enter valid postal code",
    EMAIL_ADDRESS: "Please enter email address",
    PHONE_NUMBER: "Please enter phone number",
    SERVICE_CONFIGURATION: "Please enter service configuration",
    CURRENCY: "Please enter currency",
    CONTACT_PERSON: "Please enter contact person",
    FIXED_FEE: "Please enter fixed fee",
    IMAGE_FILE_TYPE: "Please upload a valid image file",
    SOME_THING_WENT_WRONG: "Something went wrong",
    EMAIL: "Please enter email",
    OTP_WRONG_TYPE: "OTP is invalid",
    OTP_BLANK_ERROR: "Please enter the OTP",
    CODE: "Please enter code",
    LONGITUDE: "Please enter longitude",
    LATITUDE: "Please enter latitude",
    PRICE: "Please enter price",
    ROLE: "Please select role",
    VALID_EMAIL: "Please enter valid email",
};

export const API_ERRORS = {
    UNAUTHORIZED: "Unauthorized",
    NOT_FOUND: "Not Found",
    PAYLOAD_TOO_LARGE: "Payload Too Large",
    INTERNAL_SERVER_ERROR: "Internal Server Error",
    SOME_THING_WENT_WRONG: "Something went wrong",
    VALIDATION_ERROR: "Validation error"
}

export const baseURL = process.env.REACT_APP_BASE_URL;
export const REFRESH_TOKEN_KEY = "refreshToken";
export const DELAY_COUNT = 30;
export const timeFormat = 'HH:mm';

export const ROLES = [
    { id: 1, label: "ROLE_ADMIN" },
    { id: 2, label: "ROLE_CUSTOMER" },
    { id: 3, label: "ROLE_H4TADMIN" },
    { id: 5, label: "ROLE_MANAGER" },
    { id: 6, label: "ROLE_FRONTDESK" }
]

export const ACCESS_TOKEN_KEY = "accessToken";