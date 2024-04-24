import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider, Layout } from 'antd';
import { LoaderProvider } from './context/LoaderContext';
import { GlobalProvider } from './context/GlobalContext';
import './utils/i18n';
import AppLayout from './hoc/AppLayout/Index';

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
            <AppLayout />
          </BrowserRouter>
        </LoaderProvider>
      </GlobalProvider>
    </ConfigProvider>

  );
}

export default App;
