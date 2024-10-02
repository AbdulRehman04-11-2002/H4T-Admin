import { ERRORS } from "../constants/constants";

export const emailValidate = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const consecutiveDotsRegex = /\.{2,}/;

    if (!email) {
        return ERRORS.EMAIL_REQUIRED;
    }

    // Check for missing "@" symbol
    if (!email.includes("@")) {
        return ERRORS.MISSING_ATRATE;
    }

    // Check for consecutive dots
    if (consecutiveDotsRegex.test(email)) {
        return ERRORS.EMAIL_CONSECUTIVE_DTOS;
    }

    // Check if the email format is valid
    if (!emailRegex.test(email)) {
        return ERRORS.INVALID_EMAIL_FORMAT;
    }
    return ""; 
};
