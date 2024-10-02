import { Routes, Route } from 'react-router-dom';
import PartnersList from '../screens/Partners/PartnersList';
import PartnerCreate from '../screens/Partners/Create';
import ManageAccount from '../screens/ManageAccount/ManageAccount';
import LocationCreateUpdate from '../screens/ManageAccount/Location/LocationCreateUpdate';
import ProductCreateUpdate from '../screens/ManageAccount/ProductCreateUpdate';
import TermsOfUse from '../screens/TermsOfUse/Index';
import DynamicBreadcrumb from '../components/Breadcrumb/Index';
import UserCreateUpdate from '../screens/ManageAccount/userCreateUpdate';
import PlanningList from '../screens/Planning/PlanningList'
import OrderDetails from '../screens/OrderDetails';

const Routing = () => {
    return (
        <>
            <DynamicBreadcrumb />
            <Routes>
                <Route path='/' element={<PartnersList />} />
                <Route path='/order/detail/:id' element={<OrderDetails />} />
                <Route path='Partner'>
                    <Route path='' element={<PartnersList />} />
                    <Route path='Create' element={<PartnerCreate />} />
                    <Route path=':partnerID/manageAccount'>
                        <Route path='' element={<ManageAccount />} />
                        <Route path='createLocation' element={<LocationCreateUpdate />} />
                        <Route path=':locationID/updateLocation' element={<LocationCreateUpdate isUpdateForm={true} />} />
                        <Route path='createProduct' element={<ProductCreateUpdate />} />
                        <Route path=':productID/updateProduct' element={<ProductCreateUpdate isUpdateForm={true} />} />
                        <Route path='createuser' element={<UserCreateUpdate />} />
                        <Route path=':userID/updateUser' element={<UserCreateUpdate isUpdateForm={true} />} />
                    </Route>
                </Route>
                <Route path='/planning' element={<PlanningList />} />
                <Route path='/terms-of-use' element={<TermsOfUse />} />
            </Routes >
        </>
    );
};

export default Routing;
