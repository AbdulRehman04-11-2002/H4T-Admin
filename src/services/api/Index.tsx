import axios from "axios";
import { refreshToken } from "./auth";
import { Storage } from "../storage";
import { ERRORS, REFRESH_TOKEN_KEY, baseURL, API_ERRORS, API_STATUS } from "../../constants/constants";
import { RefreshTokenRequest } from "../../interface/Request";

export const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
    "x-portal": "ADMIN",
    "x-platform": "WEB",
    "x-version": "2.6"
  },
});


api.interceptors.request.use(
  async (config) => {
    const token = Storage.getAccessToken();
    config.headers['ngrok-skip-browser-warning'] = "hello Abdullah"
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request error (e.g., log or handle appropriately)
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {

    return response;
  },
  async (error) => {
    const configError = error?.config;
    let message = ERRORS.SOME_THING_WENT_WRONG;
    let statusCode = API_STATUS.INTERNAL_SERVER_ERROR;
    let errorData = [];
    if (axios.isAxiosError(error)) {
      if (
        !error.response?.data.message &&
        Object.keys(error.response?.data || {}).length > 0
      ) {
        message = JSON.stringify(error.response?.data);
      } else {
        message = error.response?.data?.message;
        if (message === API_ERRORS.VALIDATION_ERROR) errorData = error.response?.data?.error
      }
      statusCode = error.response?.status || API_STATUS.INTERNAL_SERVER_ERROR;
      if (
        statusCode === API_STATUS.UNAUTHORIZED &&
        (error?.response?.data.message.includes(API_ERRORS.TOKEN_EXPIRED) ||
          error?.response?.data.message.includes(API_ERRORS.TOKEN_REVOKED)
        )
      ) {
        const request: RefreshTokenRequest = {
          refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY) || "",
        };
        try {
          const response = await refreshToken(request);
          if (response) {
            Storage.setAccessToken(response.data.AccessToken);
            configError.headers.Authorization =
              "Bearer " + response.data.AccessToken;
            return axios(configError);
          }
        } catch {
          statusCode = API_STATUS.REFRESH_TOKEN_ERROR;
          reload();
        }
      }
      else if (
        statusCode === API_STATUS.UNAUTHORIZED &&
        (error?.response?.data.message.includes(API_ERRORS.INVALID_ACCESS_TOKEN) || error?.response?.data.message.includes(API_ERRORS.TOKEN_NOT_FOUND))
      ) {
        statusCode = API_STATUS.REFRESH_TOKEN_ERROR;
        reload();
      }
      else if (
        statusCode === API_STATUS.UNAUTHORIZED && error?.response?.headers['x-version-support-status'] === "UNSUPPORTED"
      ) {
        reload();
      }
    }
    return Promise.reject(new ApiError(statusCode, message, errorData));
  }
);
export class ApiError {
  statusCode: number;
  message: string;
  constructor(code: number, message: string, errorData: any[] | null = null) {
    this.statusCode = code;
    this.message = errorData && errorData.length
      ? errorData[0].msg //display first msg only
      : message;
  }
}

const reload = () => {
  Storage.removeAccessAndRefreshToken();
  window.location.reload();
};
