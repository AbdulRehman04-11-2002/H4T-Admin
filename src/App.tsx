import React from 'react';
import './App.css';
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
import Routing from './routes/Routing';
import AppHeader from './components/Header/Index';
import { ConfigProvider, Layout } from 'antd';
import { LoaderProvider } from './context/LoaderContext';
import { GlobalProvider } from './context/GlobalContext';
import './utils/i18n';
import { Content, Footer } from 'antd/es/layout/layout';

function App() {



  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            fontWeight: '500', // Button font weight
            colorPrimary: '#183A59', // Button text color
            boxShadow: '0 0px 0 rgba(0, 0, 0, 0.0)', // Button shadow
            defaultShadow: '0 0px 0 rgba(0, 0, 0, 0.0)', // Button shadow
            // algorithm: true, // Algorithm for calculating the color of the button text
          },
          Table: {
            // Customize the table header
            // headerBg: '#183A59', // Table header background color (e.g., light gray)
          },
          Menu: {
            // Customize the nav menu
            colorBgContainer: '#2F4F4F', // Nav background color (e.g., dark slate gray)
          },
        },
        token: {
          // You can also customize other global styles here
          colorPrimary: "#183A59",
          colorText: "#183A59",

        },
      }}
    >
      <GlobalProvider>
        <LoaderProvider>
          <BrowserRouter>
            {/* <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes> */}
            <Layout
              style={{
                minHeight: "100vh"
              }}
            >              <Layout>
                <AppHeader />
                <Content>
                  <Routing />
                </Content>
              </Layout>
              <Footer style={{ textAlign: 'center', backgroundColor: "#FAFAFA" }}>
                Health4Travel ©{new Date().getFullYear()} <Link to={"/termsofuse"}>Terms of use</Link>
              </Footer>
            </Layout>



          </BrowserRouter>
        </LoaderProvider>
      </GlobalProvider>
    </ConfigProvider>

  );
}

export default App;
