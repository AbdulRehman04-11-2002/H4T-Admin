import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../constants/contants";


const getAccessToken = () => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    return token;
};

const getRefreshToken = () => {
    const token = localStorage.getItem(REFRESH_TOKEN_KEY);
    return token;
};

const setAccessAndRefreshTokens = (idToken: string, refreshToken: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, idToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

const setRefreshToken = async (refreshToken: string) => {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

const setAccessToken = async (idToken: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, idToken);
};

const removeTokens = async (name: string) => {
    localStorage.removeItem(name);
};

const removeAccessAndRefreshToken = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
};

const setTab = (tab: string) => {
    localStorage.setItem("tab", tab);
};

const getTab = () => {
    return localStorage.getItem("tab");
};

export const Storage = {
    getAccessToken,
    getRefreshToken,
    setAccessAndRefreshTokens,
    setRefreshToken,
    setAccessToken,
    removeTokens,
    removeAccessAndRefreshToken,
    setTab,
    getTab,
};
