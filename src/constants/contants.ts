
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
    // create a dynamic error message for valid input
    VALID_INPUT: (input: string) => `Please enter valid ${input}`,
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
}

// export const baseURL = process.env.REACT_APP_BASE_URL;
export const baseURL = "https://eanfbf9tqa.execute-api.eu-west-3.amazonaws.com/prod/";
export const REFRESH_TOKEN_KEY = "refreshToken";
export const DELAY_COUNT = 30;
export const timeFormat = 'HH:mm';


export const ACCESS_TOKEN_KEY = "accessToken";