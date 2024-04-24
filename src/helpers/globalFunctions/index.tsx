import dayjs from "dayjs";
import { UploadFile, message, notification } from "antd";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { API_ERRORS } from "../../constants/contants";

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
    notification.open({
        message: false,
        description: description,
        className: className,
        icon: false,
        closeIcon: false,
    });
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

    if (statusCode === 400) {
        if (!isJSONString(message)) {
            return { statusCode, errorMessage: error?.message, obj: {} };
        } else {
            const { obj, errorMessage } = errorsMessageFocus(JSON.parse(message), inputRefs);
            return { statusCode, errorMessage, obj };
        }
    } else if (statusCode === 401) {
        return { statusCode, errorMessage: API_ERRORS.UNAUTHORIZED, obj: {} };
    } else if (statusCode === 403 || statusCode === 404) {
        return { statusCode, errorMessage: API_ERRORS.NOT_FOUND, obj: {} };
    } else if (statusCode === 413) {
        return { statusCode, errorMessage: API_ERRORS.PAYLOAD_TOO_LARGE, obj: {} };
    } else if (statusCode === 500) {
        return { statusCode, errorMessage: API_ERRORS.INTERNAL_SERVER_ERROR, obj: {} };
    } else if (statusCode === 502) {
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
