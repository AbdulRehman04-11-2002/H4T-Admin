import { Layout } from 'antd'
import { useContext, useEffect, useState } from 'react'
import AppHeader from '../Header/Index'
import { Content, Footer } from 'antd/es/layout/layout'
import Routing from '../../routes/Routing'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { GlobalContext, GlobalContextProps } from '../../context/GlobalContext'
import { Storage } from '../../services/storage'
import { RefreshTokenRequest } from '../../interface/Request'
import { refreshToken } from '../../services/api/auth'
import Login from '../../screens/Login/Index'
import TermsOfUse from '../../screens/TermsOfUse/Index'
import { LoaderContext, LoaderContextValue } from '../../context/LoaderContext'
import Loader from '../Loader'

function AppLayout() {
    const { t } = useTranslation();
    const { setME } = useContext(GlobalContext) as GlobalContextProps;
    const navigate = useNavigate();
    const [token, setToken] = useState<boolean>(
        Storage.getAccessToken() ? true : false
    );
    const { isLoading } = useContext(LoaderContext) as LoaderContextValue;

    const MINUTES = 50;

    const tokenIsActive = async () => {
        try {
            const token = Storage.getRefreshToken();
            const request: RefreshTokenRequest = {
                refreshToken: token || "",
            };
            const response = await refreshToken(request);
            if (response) {
                Storage.setAccessToken(response?.data?.AccessToken);
                setToken(true); // Set the new token state to indicate user authentication
            }
        } catch (error) {
            setToken(false);
            Storage.removeAccessAndRefreshToken();
        }
    };

    const logOutClickHandler = () => {
        setToken(false);
        Storage.removeAccessAndRefreshToken();
        setME({});
        navigate("/login");
    }

    useEffect(() => {
        if (token) {
            tokenIsActive(); //when page load
            const interval = setInterval(tokenIsActive, MINUTES * 60000); // Execute tokenIsActive every 2 minutes (2 minutes * 60 seconds * 1000 milliseconds)
            return () => clearInterval(interval); // Cleanup interval on component unmount
        }
    }, [token]);


    return (<>
        {isLoading && <Loader />}
        <Routes>
            <Route
                path='/auth/login'
                element={
                    !token ? <Login setToken={setToken} /> : <Navigate to='/' />
                }
            />
            <Route
                path='/auth/*'
                element={
                    !token ? <Navigate to='/auth/login' /> : <Navigate to='/' />
                }
            />
            <Route path='/terms-of-use' element={<TermsOfUse />} />
            <Route
                path='/*'
                element={
                    !token ? (
                        <Navigate to='/auth/login' />
                    ) : (
                        <Layout
                            style={{
                                minHeight: "100vh",
                                // background: theme.colors.grey.grey30,
                            }}
                        >
                            <Layout>
                                <AppHeader logOutClickHandler={logOutClickHandler} />
                                <Content>
                                    <Routing />
                                </Content>
                                <Footer>
                                    
                                </Footer>
                            </Layout>
                        </Layout>
                    )
                }
            />
        </Routes>
    </>
    )
}

export default AppLayout