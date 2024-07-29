
export enum ORDER_BACKEND_STATUS {
    CONFIRMED = "CONFIRMED",
    PAID = "PAID",
    IN_PROGRESS = "INPROGRESS",
    PENDING = "PENDING",
    NO_SHOW = "NO_SHOW",
    PAYMENT_PENDING = "PAYMENT_PENDING",
    COMPLETED = "COMPLETE",
    DRAFT = "DRAFT"
}

export enum ORDER_STATUS {
    DRAFT = "Payment pending",
    PENDING = "Confirmed",
    CONFIRMED = "Confirmed",
    PAID = "Paid",
    INPROGRESS = "Checked - in",
    COMPLETE = "Completed",
    PAYMENT_PENDING = "Payment pending",
    NO_SHOW = "No show"
}

export enum ORDER_STATUS_COLORS {
    RED = "red",
    GREEN = "green",
    BLUE = "blue",
    ORANGE = "orange",
    DARK_GREEN = "darkgreen"
}

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
    VALIDATION_ERROR: "Validation error",
    REFRESH_TOKEN_ERROR: "Error refreshing Access Token",
    INVALID_ACCESS_TOKEN: "Invalid Access Token",
    TOKEN_NOT_FOUND: "Token not found",
    TOKEN_EXPIRED: "NotAuthorizedException: Access Token has expired",
    TOKEN_REVOKED: "NotAuthorizedException: Access Token has been revoked"
}

export const API_STATUS = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND2: 403,
    NOT_FOUND: 404,
    REFRESH_TOKEN_ERROR: 405,
    PAYLOAD_TOO_LARGE: 413,
    INTERNAL_SERVER_ERROR: 500,
    INTERNAL_SERVER_ERROR2: 502
}
export const defaultPlannerSortBy = "serviceDateTime";
export const defaultTimezone = "Europe/Amsterdam";
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

export const ROLEIDS = {
    CLINIC_ADMIN: 1,
    CUSTOMER: 2,
    H4T_ADMIN: 3,
    CLINIC_MANAGER: 5,
    CLINIC_FRONTDESK: 6
}

export const ACCESS_TOKEN_KEY = "accessToken";