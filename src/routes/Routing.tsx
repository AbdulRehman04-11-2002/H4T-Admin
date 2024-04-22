import { Routes, Route } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb/Index';
import PartnersList from '../screens/Partners/PartnersList';
import PartnerCreate from '../screens/Partners/Create';
import ManageAccount from '../screens/ManageAccount/ManageAccount';
import LocationCreateUpdate from '../screens/ManageAccount/LocationCreateUpdate';
import ProductCreateUpdate from '../screens/ManageAccount/ProductCreateUpdate';
import TermsOfUse from '../screens/TermsOfUse/Index';
import DynamicBreadcrumb from '../components/Breadcrumb/Index';
import UserCreateUpdate from '../screens/ManageAccount/userCreateUpdate';

const Routing = () => {
    return (
        <>
            <DynamicBreadcrumb />
            <Routes>
                <Route path='/' element={<PartnersList />} />
                <Route path='Partner'>
                    <Route path='' element={<PartnersList />} />
                    <Route path='Create' element={<PartnerCreate />} />
                    <Route path=':partnerID/ManageAccount'>
                        <Route path='' element={<ManageAccount />} />
                        <Route path='createLocation' element={<LocationCreateUpdate />} />
                        <Route path=':locationID/updatelocation' element={<LocationCreateUpdate isUpdateForm={true} />} />
                        <Route path='createProduct' element={<ProductCreateUpdate />} />
                        <Route path=':productID/updateproduct' element={<ProductCreateUpdate isUpdateForm={true} />} />
                        <Route path='createuser' element={<UserCreateUpdate />} />
                        <Route path=':userID/updateuser' element={<UserCreateUpdate isUpdateForm={true} />} />
                    </Route>
                </Route>
                <Route path='/terms-of-use' element={<TermsOfUse />} />
            </Routes >
        </>
    );
};

export default Routing;
