import { ERRORS } from "../constants/constants";

const CONSECUTIVE_DOTS_REGEX = /\.{2,}/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const emailValidate = (email: string): string => {
    if (!email) {
        return ERRORS.EMAIL_REQUIRED;
    }

    if (!email.includes("@")) {
        return ERRORS.MISSING_ATRATE;
    }

    if (!EMAIL_REGEX.test(email)) {
        return ERRORS.INVALID_EMAIL_FORMAT;
    }

    if (CONSECUTIVE_DOTS_REGEX.test(email)) {
        return ERRORS.EMAIL_CONSECUTIVE_DTOS;
    }
    
    return "";
};