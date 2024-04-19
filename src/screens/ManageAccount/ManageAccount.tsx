import { Tabs } from 'antd';
import { useContext, useEffect, useState } from 'react'
import {
    EnvironmentOutlined,
    BarsOutlined,
    UsergroupAddOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import ListView from '../../components/GeneralListView/Index';
import { LocationColumns } from '../../components/TableColumns/LocationColumns';
import PartnerCreateUpdate from '../Partners/Create';
import { ProductsColumns } from '../../components/TableColumns/ProductsColumns';
import { UsersColumns } from '../../components/TableColumns/UsersColumns';
import { Storage } from '../../services/storage';
import { useTranslation } from 'react-i18next';
import { LoaderContext, LoaderContextValue } from '../../context/LoaderContext';
import { handleErrorResponse, openToastNotification } from '../../helpers/globalFunctions';
import { ApiError } from '../../services/api/Index';
import { getPartnerUsers } from '../../services/api/partner';
import { User } from '../../interface/PartnerUser';
import Loader from '../../components/Loader';
import { getPartnerLocations } from '../../services/api/partnerLocation';
import { getPartnerProducts } from '../../services/api/partnerProduct';
import { GlobalContext, GlobalContextProps } from '../../context/GlobalContext';
import { PartnerLocation } from '../../interface/PartnerLocation';
import { PartnerProduct } from '../../interface/PartnerProduct';
function ManageAccount() {
    const { t } = useTranslation();
    const TABLE_NO_RECORDS_TEXT: any = t("TABLE_NO_RECORDS_TEXT", { returnObjects: true });
    const TABS_LABEL: any = t("TABS_LABEL", { returnObjects: true });

    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [search, setSearch] = useState<string>("");
    const [searchValue, setSearchValue] = useState<string>("");
    const [totalRecord, setTotalRecord] = useState<number>(0);
    const [currentTab, setCurrentTab] = useState<string>("Profile");
    const { isLoading, showLoader, hideLoader } = useContext(LoaderContext) as LoaderContextValue;
    const [currentTableTab, setCurrentTableTab] = useState("enabled")
    const [users, setUsers] = useState<User[]>([]); // chnage name  from user to partner user, also for products and locations
    const [locations, setLocations] = useState<PartnerLocation[]>([]);
    const [products, setProducts] = useState<PartnerProduct[]>([]);

    const { ME, success, setSuccess } = useContext(GlobalContext) as GlobalContextProps;

    const navigate = useNavigate();
    let params = useParams();

    let partnerID = params.partnerID || "";

    const leftTabOnChange = (currentTab: string) => {
        setCurrentTab(currentTab);
        showLoader();
        Storage.setTab(currentTab);
        if (currentTab === TABS_LABEL.PROFILE) {
            navigate(`/Partner/${partnerID}/ManageAccount`);
        } else {
            showLoader();
            setCurrentTableTab("enabled")
            setSearchValue("");
            setPage(1);
        }
    };

    const onTableTabChange = (tab: string) => {
        setCurrentTableTab(tab);
        getPartnerDetails(currentTab, tab);
        setPage(1);
        setSearchValue("");
        setSearch("");
    }

    const getPartnerDetails = async (currentTab: string, tableTab?: string) => {
        showLoader();
        switch (currentTab) {
            case TABS_LABEL.PROFILE:
                navigate(`/Partner/${partnerID}/ManageAccount`);
                return null;
            case TABS_LABEL.LOCATIONS:
                const location = await fetchPartnerDetails(getPartnerLocations, tableTab || "Enabled");
                setLocations(location?.data?.response?.results);
                setTotalRecord(location?.data?.response?.count);
                return null;
            case TABS_LABEL.PRODUCTS:
                const product = await fetchPartnerDetails(getPartnerProducts, tableTab || "Enabled");
                setProducts(product?.data?.partnerProducts?.results);
                setTotalRecord(product?.data?.partnerProducts?.count);
                return null;
            case TABS_LABEL.USER_ACCESS:
                const user = await fetchPartnerDetails(getPartnerUsers, tableTab || "Enabled");
                setUsers(user?.data?.response?.results);
                setTotalRecord(user?.data?.response?.count);
                return null;
            default:
                return null;
        }
    }

    const fetchPartnerDetails = async (funcName: any, tableTab: string) => {
        showLoader();
        try {
            const response = await funcName(page, pageSize, search, tableTab?.toUpperCase() || currentTableTab.toUpperCase(), partnerID);
            return response;
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
        getPartnerDetails(Storage.getTab() || TABS_LABEL.PROFILE, "Enabled");
    }, [page, pageSize, currentTab, currentTableTab, search])

    useEffect(() => {
        setCurrentTab(Storage.getTab() || TABS_LABEL.PROFILE);
        setPage(1);
    }, [navigate])


    useEffect(() => {
        if (success) {
            openToastNotification(
                success,
                "notifications toast-notification-success"
            );
            setSuccess("");
        }
    }, [])


    return (
        <div className='manage-account-content'>
            <Tabs
                tabPosition={"left"}
                style={{ height: "100%", padding: 0 }}
                onChange={leftTabOnChange}
                activeKey={currentTab}
                items={[
                    {
                        label: (
                            <span className='text-capitalize'>{TABS_LABEL.PROFILE}</span>
                        ),
                        key: TABS_LABEL.PROFILE, children: <PartnerCreateUpdate isUpdateForm={true} />, icon: <BarsOutlined />
                    },
                    {
                        label: "locations", key: TABS_LABEL.LOCATIONS, children:

                            <ListView
                                tabOnChange={onTableTabChange}
                                data={locations}
                                page={page}
                                search={search}
                                setPage={setPage}
                                loading={isLoading}
                                noRecordText={TABLE_NO_RECORDS_TEXT.LOCATIONS}
                                columns={LocationColumns({ partnerID: partnerID })}
                                createPath={`/Partner/${partnerID}/ManageAccount/createLocation`}
                                pageSize={pageSize}
                                totalRecord={totalRecord}
                                getRecords={() => null}
                                currentTab={currentTableTab}
                                scroll={500}
                                isLoading={isLoading}
                                searchValue={searchValue}
                                setSearchValue={setSearchValue}
                                setPageSize={setPageSize}
                                setSearch={setSearch}
                            />,
                        icon: <EnvironmentOutlined />
                    },
                    {
                        label: (
                            <span className='text-capitalize'>{TABS_LABEL.PRODUCTS}</span>
                        ),
                        key: TABS_LABEL.PRODUCTS, children: <ListView
                            tabOnChange={onTableTabChange}
                            data={products}
                            page={page}
                            search={search}
                            setPage={setPage}
                            loading={isLoading}
                            noRecordText={TABLE_NO_RECORDS_TEXT.PRODUCTS}
                            columns={ProductsColumns({ partnerID: partnerID, ME: ME })}
                            createPath={`/Partner/${partnerID}/ManageAccount/createProduct`}
                            pageSize={pageSize}
                            totalRecord={totalRecord}
                            getRecords={() => null}
                            currentTab={currentTableTab}
                            scroll={500}
                            isLoading={isLoading}
                            searchValue={searchValue}
                            setSearchValue={setSearchValue}
                            setPageSize={setPageSize}
                            setSearch={setSearch}
                        />, icon: <BarsOutlined />
                    },
                    {
                        label: (
                            <span className='text-capitalize'>{TABS_LABEL.USER_ACCESS}</span>
                        ),
                        key: TABS_LABEL.USER_ACCESS, children: <ListView
                            tabOnChange={onTableTabChange}
                            data={users}
                            page={page}
                            search={search}
                            setPage={setPage}
                            loading={false}
                            noRecordText={TABLE_NO_RECORDS_TEXT.USERS}
                            columns={UsersColumns({ partnerID: partnerID })}
                            createPath={`/Partner/${partnerID}/ManageAccount/createUser`}
                            pageSize={pageSize}
                            totalRecord={totalRecord}
                            getRecords={() => null}
                            currentTab={currentTableTab}
                            scroll={500}
                            isLoading={isLoading}
                            searchValue={searchValue}
                            setSearchValue={setSearchValue}
                            setPageSize={setPageSize}
                            setSearch={setSearch}
                        />, icon: <UsergroupAddOutlined />
                    },
                ]}
            />
        </div>
    )
}



export default ManageAccount