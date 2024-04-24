import axios from "axios";
import { refreshToken } from "./auth";
import { Storage } from "../storage";
import { ERRORS, REFRESH_TOKEN_KEY, baseURL } from "../../constants/contants";
import { RefreshTokenRequest } from "../../interface/Request";

export const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use(
  async (config) => {
    const token = Storage.getAccessToken();

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
    let statusCode = 500;
    if (axios.isAxiosError(error)) {
      if (
        !error.response?.data.message &&
        Object.keys(error.response?.data || {}).length > 0
      ) {
        message = JSON.stringify(error.response?.data);
      } else {
        message = error.response?.data?.message;
      }
      statusCode = error.response?.status || 500;
      if (
        statusCode === 500 &&
        error?.response?.data.message.includes("expired")
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
          reload();
        }
      } else if (
        statusCode === 401 &&
        !error?.response?.data.message.includes("expired")
      ) {
        reload();
      }
    }
    return Promise.reject(new ApiError(statusCode, message));
  }
);
export class ApiError {
  statusCode: number;
  message: string;
  constructor(code: number, message: string) {
    this.statusCode = code;
    this.message = message;
  }
}

const reload = () => {
  Storage.removeAccessAndRefreshToken();
  window.location.reload();
};
