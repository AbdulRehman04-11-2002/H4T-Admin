import { Routes, Route } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb/Index';
import PartnersList from '../screens/Partners/Index';
import PartnerCreate from '../screens/Partners/Create';
import ManageAccount from '../screens/ManageAccount/ManageAccount';
import Login from '../screens/Login/Index';
import Sidebar from '../components/SideBar';
import LocationCreateUpdate from '../screens/ManageAccount/LocationCreateUpdate';
import ProductCreateUpdate from '../screens/ManageAccount/ProductCreateUpdate';
import UserCreateUpdate from '../screens/ManageAccount/userCreateUpdate';
import TermsOfuse from '../screens/TermsOfUse/Index';

const Routing = () => {
    return (
        <>
            <div className=''>
                {window.location.pathname !== '/login'
                    && <Breadcrumb />}

            </div>
            <Routes>
                <Route path='/' element={<PartnersList />} />
                <Route path='/login' element={<Login />} />
                <Route path="/termsofuse" element={<TermsOfuse />} />
                <Route path='Partner'>
                    <Route path='' element={<PartnersList />} />
                    <Route path='Create' element={<PartnerCreate />} />
                    <Route path=':partnerID/ManageAccount' element={<ManageAccount />} />
                    <Route path=':partnerID/ManageAccount/createLocation' element={<LocationCreateUpdate />} />
                    <Route path=':partnerID/ManageAccount/:locationID/updatelocation' element={<LocationCreateUpdate isUpdateForm={true} />} />
                    <Route path=':partnerID/ManageAccount/createProduct' element={<ProductCreateUpdate />} />
                    <Route path=':partnerID/ManageAccount/:productID/updateproduct' element={<ProductCreateUpdate isUpdateForm={true} />} />
                    <Route path=':partnerID/ManageAccount/createuser' element={<UserCreateUpdate />} />
                    <Route path=':partnerID/ManageAccount/:userID/updateuser' element={<UserCreateUpdate isUpdateForm={true} />} />
                </Route>
            </Routes>
        </>
    )
}

export default Routing;