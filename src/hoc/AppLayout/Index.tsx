import { Layout } from 'antd';
import { useContext, useEffect, useState } from 'react';
import AppHeader from '../../components/Header/Index';
import { Content, Footer } from 'antd/es/layout/layout';
import Routing from '../../routes/Routing';
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GlobalContext, GlobalContextProps } from '../../context/GlobalContext';
import { Storage } from '../../services/storage';
import { RefreshTokenRequest } from '../../interface/Request';
import { refreshToken } from '../../services/api/auth';
import Login from '../../screens/Login/Index';
import { LoaderContext, LoaderContextValue } from '../../context/LoaderContext';
import Loader from '../../components/Loader';
import { getME } from '../../services/api/global';
import { handleErrorResponse, openToastNotification } from '../../helpers/globalFunctions';
import { ApiError } from '../../services/api/Index';

function AppLayout() {
    const { t } = useTranslation();
    const LABELS: any = t("LABELS", { returnObjects: true });
    const { setME, ME, setUserDetails } = useContext(GlobalContext) as GlobalContextProps;
    const navigate = useNavigate();
    const [token, setToken] = useState<boolean>(
        Storage.getAccessToken() ? true : false
    );
    const { isLoading, showLoader, hideLoader } = useContext(LoaderContext) as LoaderContextValue;
    const location = useLocation();
    const [prevLocation, setPrevLocation] = useState<any>(null);
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

    const getMEData = async () => {
        showLoader();
        try {
            const result = await getME("ENABLED");
            setUserDetails(
                {
                    name: result.name,
                    imageUrl: result.imageUrl,
                    phoneNumber: result.phoneNumber,
                    email: result.email,
                    role: result.role,
                }
            )
            setME(result);

        } catch (error) {
            const _error = error as ApiError;
            const { errorMessage } = handleErrorResponse(_error);
            openToastNotification(
                errorMessage,
                "notifications toast-notification-error"
            );
            console.log("error", _error);
        } finally {
            hideLoader();
        }
    }

    useEffect(() => {
        setPrevLocation(location);
    }, [location]);

    useEffect(() => {
        token && !prevLocation?.pathname?.includes("auth") && getMEData();
    }, [])

    useEffect(() => {
        if (token) {
            tokenIsActive(); //when page load
            const interval = setInterval(tokenIsActive, MINUTES * 60000); // Execute tokenIsActive every 2 minutes (2 minutes * 60 seconds * 1000 milliseconds)
            return () => clearInterval(interval); // Cleanup interval on component unmount
        }
    }, [token]);


    return (<>
        {isLoading && <Loader />}
        <Layout style={{ minHeight: "100vh" }}>
            <Layout>
                {token && <AppHeader logOutClickHandler={logOutClickHandler} ME={ME} />}
                <Content>
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

                        <Route
                            path='/*'
                            element={
                                !token ? (
                                    <Navigate to='/auth/login' />
                                ) : (
                                    <Layout
                                        style={{
                                            minHeight: "100vh",
                                        }}
                                    >
                                        <Layout>
                                            <Content>
                                                <Routing />
                                            </Content>
                                            <Footer style={{ textAlign: 'center', backgroundColor: "#FAFAFA" }}>
                                                Health4Travel ©{new Date().getFullYear()} <Link target="_blank" to={"/terms-of-use"}>{LABELS.TERMS_OF_USE}</Link>
                                            </Footer>
                                        </Layout>
                                    </Layout>
                                )
                            }
                        />
                    </Routes>
                </Content>
            </Layout>
        </Layout>
    </>
    )
}

export default AppLayout;
