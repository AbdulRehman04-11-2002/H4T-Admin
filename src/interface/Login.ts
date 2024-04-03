import { InternalNamePath } from "../type/login.type";

export interface ValidateErrorEntity<Values = any> {
    values: Values;
    errorFields: {
        name: InternalNamePath;
        errors: string[];
    }[];
    outOfDate: boolean;
}

export interface LoginProps {
    setToken?: any
}