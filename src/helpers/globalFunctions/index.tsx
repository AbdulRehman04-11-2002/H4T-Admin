import dayjs from "dayjs";
import { UploadFile, message, notification } from "antd";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { API_ERRORS, API_STATUS } from "../../constants/constants";

dayjs.extend(customParseFormat);

export const checkEmptyString = (e: string): boolean => {
    switch (e) {
        case "":
        case "0":
        case null:
        case undefined:
            return false;
        default:
            return true;
    }
};

export const validateFileType = (
    { type }: UploadFile,
    allowedTypes?: string
) => {
    if (!allowedTypes) return true;
    if (type) {
        const allowedTypesArray = allowedTypes
            .split(",")
            .map((type) => type.trim());
        return allowedTypesArray.includes(type);
    }
    return false;
};

export const errorsMessageFocus = (
    errorMsg: { errors: { path: string; msg: string }[] },
    inputRefs: any
) => {
    let focused = false;
    let obj = {};
    let errorMessage = "";
    errorMsg?.errors?.forEach(
        (error: { path: string; msg: string }, index: number) => {
            const { path } = error;
            const inputRef = inputRefs[path];
            if (!focused) {
                inputRef?.current.focus();
                focused = true;
            }
            if (!errorMessage) {
                errorMessage = error.msg;
            }
            obj = { ...obj, [path]: true };
        }
    );
    return { obj, errorMessage };
};

export const openToastNotification = (
    description: string,
    className: string
) => {
    if (description) {
        notification.open({
            message: false,
            description: description,
            className: className,
            icon: false,
            closeIcon: false,
        });
    }
};

const isJSONString = (inputString: any) => {
    try {
        JSON.parse(inputString);
        return true;
    } catch (error) {
        return false;
    }
}

export const handleErrorResponse = (
    error: { statusCode: number | undefined; message: string },
    inputRefs?: any) => {
    const { statusCode, message } = error;

    if (statusCode === API_STATUS.BAD_REQUEST) {
        if (!isJSONString(message)) {
            return { statusCode, errorMessage: error?.message, obj: {} };
        } else {
            const { obj, errorMessage } = errorsMessageFocus(JSON.parse(message), inputRefs);
            return { statusCode, errorMessage, obj };
        }
    } else if (statusCode === API_STATUS.UNAUTHORIZED) {
        return { statusCode, errorMessage: API_ERRORS.UNAUTHORIZED, obj: {} };
    } else if (statusCode === API_STATUS.NOT_FOUND2 || statusCode === API_STATUS.NOT_FOUND) {
        return { statusCode, errorMessage: API_ERRORS.NOT_FOUND, obj: {} };
    } else if (statusCode === API_STATUS.PAYLOAD_TOO_LARGE) {
        return { statusCode, errorMessage: API_ERRORS.PAYLOAD_TOO_LARGE, obj: {} };
    } else if (statusCode === API_STATUS.REFRESH_TOKEN_ERROR) {
        return { statusCode, errorMessage: "", obj: {} };
    } else if (statusCode === API_STATUS.INTERNAL_SERVER_ERROR) {
        return { statusCode, errorMessage: API_ERRORS.INTERNAL_SERVER_ERROR, obj: {} };
    } else if (statusCode === API_STATUS.INTERNAL_SERVER_ERROR2) {
        return { statusCode, errorMessage: API_ERRORS.INTERNAL_SERVER_ERROR, obj: {} };
    } else {
        return { statusCode, errorMessage: API_ERRORS.SOME_THING_WENT_WRONG, obj: {} };

    }
};


export const showError = (errorMessage: string) => {
    message.config({
        maxCount: 1,
    });
    message.open({
        content: errorMessage,
    });
};

export const getCountryCodeByIp = async () => {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    if (data && data.country_code) {
        return data.country_code.toLowerCase();
    }
}

export const formatToTwoDecimalPlaces = (value: number): number => {
    if (value < 0) return -formatToTwoDecimalPlaces(-value);
    return +(Math.round(+(value + 'e+2')) + 'e-2');
};