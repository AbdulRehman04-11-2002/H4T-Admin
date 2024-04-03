import React, { createContext, useState } from 'react';

interface GlobalContextState {
    success: string;
    userDetails: {
        name: string;
        image: string;
        mobileNumber: string;
    };
}

export interface GlobalContextProps extends GlobalContextState {
    setSuccess: (success: string) => void;
    clearMessage: () => void;
    setUserDetails: (userDetails: {
        name: string;
        image: string;
        mobileNumber: string;
    }) => void;
}

interface GlobalProviderProps {
    children: React.ReactNode;
}

export const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
    const [state, setState] = useState<GlobalContextState>({
        success: '',
        userDetails: {
            name: '',
            image: '',
            mobileNumber: '',
        },
    });

    const setSuccess = (success: string) => {
        setState((prevState) => ({ ...prevState, success }));
    };

    const clearMessage = () => {
        setState((prevState) => ({ ...prevState, success: '' }));
    };

    const setUserDetails = (userDetails: {
        name: string;
        image: string;
        mobileNumber: string;
    }) => {
        setState((prevState) => ({ ...prevState, userDetails }));
    };

    const value = {
        ...state,
        setSuccess,
        clearMessage,
        setUserDetails,
    };

    return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
};