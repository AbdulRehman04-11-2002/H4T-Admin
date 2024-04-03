import { ReactNode, createContext, useState } from 'react';

interface LoaderProviderProps {
    children: ReactNode;
}

export interface LoaderContextValue {
    isLoading: boolean;
    showLoader: () => void;
    hideLoader: () => void;
}

export const LoaderContext = createContext<LoaderContextValue | null>(null);

export const LoaderProvider = ({ children }: LoaderProviderProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const showLoader = () => setIsLoading(true);
    const hideLoader = () => setIsLoading(false);

    return (
        <LoaderContext.Provider value={{ isLoading, showLoader, hideLoader }}>
            {children}
        </LoaderContext.Provider>
    );
};