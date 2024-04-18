import React, { createContext, useState } from 'react';
import { Storage } from '../services/storage';

interface GlobalContextState {
    success: string;
    userDetails: {
        name: string;
        image: string;
        mobileNumber: string;
        email: string;
    };
    ME: any;

}

export interface GlobalContextProps extends GlobalContextState {
    setSuccess: (success: string) => void;
    clearMessage: () => void;
    setUserDetails: (userDetails: {
        name: string;
        image: string;
        mobileNumber: string;
        email: string;
    }) => void;
    setME: (ME: any) => void;
    userDetails: {
        name: string;
        image: string;
        mobileNumber: string;
        email: string;
    };


}

interface GlobalProviderProps {
    children: React.ReactNode;
}

export const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
    const ME = Storage.getMEData();
    const [state, setState] = useState<GlobalContextState>({
        success: '',
        userDetails: {
            name: '',
            image: '',
            mobileNumber: '',
            email: ''
        },
        ME: ME ? ME : {},
    });

    const setSuccess = (success: string) => {
        setState((prevState) => ({ ...prevState, success }));
    };

    const clearMessage = () => {
        setState((prevState) => ({ ...prevState, success: '' }));
    };

    const setME = (ME: any) => {
        setState((prevState) => ({ ...prevState, ME }));
        Storage.setMEData(ME);
    };

    const setUserDetails = (userDetails: {
        name: string;
        image: string;
        mobileNumber: string;
        email: string;
    }) => {
        setState((prevState) => ({ ...prevState, userDetails }));
    };

    const value = {
        ...state,
        setSuccess,
        clearMessage,
        setUserDetails,
        setME
    };

    return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
};