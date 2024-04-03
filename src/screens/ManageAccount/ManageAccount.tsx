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
function ManageAccount() {
    const { t } = useTranslation();
    const TABLE_NO_RECORDS_TEXT: any = t("TABLE_NO_RECORDS_TEXT", { returnObjects: true });
    const TABS_LABEL: any = t("TABS_LABEL", { returnObjects: true });

    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [search, setSearch] = useState<string>("");
    const [currentTab, setCurrentTab] = useState<string>("Profile");
    const { isLoading, showLoader, hideLoader } = useContext(LoaderContext) as LoaderContextValue;
    const [currentTableTab, setCurrentTableTab] = useState("enabled")
    const navigate = useNavigate();
    let params = useParams();

    let partnerID = params.partnerID || "";

    const locations = [
        {
            id: 1,
            CODE: "ABC",
            NAME: "ABC Partners Ltd.",
            CITY: "New York"
        },
        {
            id: 2,
            CODE: "XYZ",
            NAME: "XYZ Solutions Inc.",
            CITY: "San Francisco"
        },
        {
            id: 3,
            CODE: "GLO",
            NAME: "Global Enterprises",
            CITY: "Chicago"
        },
        {
            id: 4,
            CODE: "TEC",
            NAME: "Techno Innovators",
            CITY: "Seattle"
        },
        {
            id: 5,
            CODE: "XYZ",
            NAME: "XYZ Solutions Inc.",

            CITY: "San Francisco"
        },
        {
            id: 6,
            CODE: "GLO",
            NAME: "Global Enterprises",
            CITY: "Chicago"
        },
    ];

    const products = [
        {
            id: 1,
            CODE: "ABC",
            NAME: "ABC Partners Ltd.",
            SERVICE_TYPE: "Logistics",
            LAST_MODIFIED: "2021-09-01"
        },
        {
            id: 2,
            CODE: "XYZ",
            NAME: "XYZ Solutions Inc.",
            SERVICE_TYPE: "IT Consulting",
            LAST_MODIFIED: "2021-09-02"
        },
        {
            id: 3,
            CODE: "GLO",
            NAME: "Global Enterprises",
            SERVICE_TYPE: "Manufacturing",
            LAST_MODIFIED: "2021-09-03"
        },
        {
            id: 4,
            CODE: "TEC",
            NAME: "Techno Innovators",
            SERVICE_TYPE: "Cybersecurity",
            LAST_MODIFIED: "2021-09-04"
        },
        {
            id: 5,
            CODE: "XYZ",
            NAME: "XYZ Solutions Inc.",
            SERVICE_TYPE: "IT Consulting",
            LAST_MODIFIED: "2021-09-02"
        },
        {
            id: 6,
            CODE: "GLO",
            NAME: "Global Enterprises",
            SERVICE_TYPE: "Manufacturing",
            LAST_MODIFIED: "2021-09-03"
        },
        {
            id: 7,
            CODE: "TEC",
            NAME: "Techno Innovators",
            SERVICE_TYPE: "Cybersecurity",
            LAST_MODIFIED: "2021-09-04"
        },
        {
            id: 8,
            CODE: "XYZ",
            NAME: "XYZ Solutions Inc.",
            SERVICE_TYPE: "IT Consulting",
            LAST_MODIFIED: "2021-09-02"
        },
        {
            id: 9,
            CODE: "GLO",
            NAME: "Global Enterprises",
            SERVICE_TYPE: "Manufacturing",
            LAST_MODIFIED: "2021-09-03"
        }
    ];

    const usersData = [
        {
            "id": 1,
            "NAME": "John Doe",
            "EMAIL": "john.doe@example.com",
            "ROLE": "Admin"
        },
        {
            "id": 2,
            "NAME": "Jane Smith",
            "EMAIL": "jane.smith@example.com",
            "ROLE": "Employee"
        },
        {
            "id": "3",
            "NAME": "Alice Johnson",
            "EMAIL": "alice.johnson@example.com",
            "ROLE": "Manager"
        },
        {
            "id": "4",
            "NAME": "Bob Brown",
            "EMAIL": "bob.brown@example.com",
            "ROLE": "Employee"
        },
        {
            "id": "5",
            "NAME": "Eva Garcia",
            "EMAIL": "eva.garcia@example.com",
            "ROLE": "Admin"
        },
        {
            "id": "6",
            "NAME": "David Lee",
            "EMAIL": "david.lee@example.com",
            "ROLE": "Employee"
        },
        {
            "id": "7",
            "NAME": "Sophia Kim",
            "EMAIL": "sophia.kim@example.com",
            "ROLE": "Manager"
        },
        {
            "id": "8",
            "NAME": "Michael Chen",
            "EMAIL": "michael.chen@example.com",
            "ROLE": "Employee"
        },
        {
            "id": "9",
            "NAME": "Olivia Rodriguez",
            "EMAIL": "olivia.rodriguez@example.com",
            "ROLE": "Admin"
        },
        {
            "id": "10",
            "NAME": "William Nguyen",
            "EMAIL": "william.nguyen@example.com",
            "ROLE": "Employee"
        },
        {
            "id": "11",
            "NAME": "Emma Patel",
            "EMAIL": "emma.patel@example.com",
            "ROLE": "Manager"
        },
        {
            "id": "12",
            "NAME": "Daniel Smith",
            "EMAIL": "daniel.smith@example.com",
            "ROLE": "Employee"
        },
        {
            "id": "13",
            "NAME": "Isabella Brown",
            "EMAIL": "isabella.brown@example.com",
            "ROLE": "Admin"
        },
        {
            "id": "14",
            "NAME": "Alexander Kim",
            "EMAIL": "alexander.kim@example.com",
            "ROLE": "Employee"
        },
        {
            "id": "15",
            "NAME": "Mia Hernandez",
            "EMAIL": "mia.hernandez@example.com",
            "ROLE": "Manager"
        }
    ]


    let data = {
        "name": "Muhammad Sufyan",
        "businessId": "313232",
        "licenseNumber": "43432",
        "status": "enabled",
        "uploadLogo": {
            uid: '-1',
            name: 'yyy.png',
            status: 'done',
            url: 'https://st2.depositphotos.com/4328131/8011/v/950/depositphotos_80110546-stock-illustration-company-logo-template.jpg',
            thumbUrl: 'https://st2.depositphotos.com/4328131/8011/v/950/depositphotos_80110546-stock-illustration-company-logo-template.jpg',
        },
        "contactNumber": "03082078178",
        "searchAndSelectCity": "karachi",
        "registeredStreetAddress": "House#260, Block:B, Street#07, New Gulshan labor colony site karachi",
        "registeredPostalCode": "75500",
        "emailAddress": "sufyan822@gmail.com",
        "phoneNumber": "03082078178",
        "contactPerson": "Muhammad Sufyan",
        "serviceType": "doctorConsultation",
        "docConsFixedFee": "100",
    }

    const newData = {
        "id": 1,
        "name": "Adams Health Service Inc.",
        "businessId": "6757-AD",
        "imageUrl": "2c5a1f72f159.PNG",
        "licenseNumber": "MED-023383",
        "contractNumber": "H4T-SED123",
        "registeredStreetAddress": "Björkvägen 88",
        "registeredPostalCode": "310 31",
        "contactPerson": "John Doe",
        "phoneNumber": "46726412729",
        "emailAddress": "john.doe@mailinator.com",
        "status": "ENABLED",
        "registeredCity": 5,
        "currancy": 3

    }

    const locationsUpdateViewData = {
        "name": "rr",
        "code": "rr",
        "price": "rr",
        "description": "res ",
        "customGuidelines": "sdfd",
        "status": "enabled",
        "serviceType": "",
        "isAdminAccount": false,
        "image": [],
        "selectedLocations": [
            "tampere",
            "oulu"
        ]
    }

    useEffect(() => {
        setCurrentTab(Storage.getTab() || TABS_LABEL.PROFILE);
    }, [navigate])


    const onSearch = (value: string) => {
        setSearch(value);
    };

    const tabOnChange = (currentTab: string) => {
        setCurrentTableTab("enabled")

        setCurrentTab(currentTab);
        Storage.setTab(currentTab);
    };

    const handlePageSizeChange = (current: number = 1, pageSize: number) => {
        setPageSize(pageSize);
    };

    const getLocations = () => {
        try {
            showLoader();
            // const response = await getLocations(page, pageSize, search, currentTab);
            // setLocations(response?.data?.response?.results);
            // setTotalRecord(response?.data?.response?.count);
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

    const getProducts = () => {
        try {
            showLoader();
            // const response = await getProducts(page, pageSize, search, currentTab);
            // setProducts(response?.data?.response?.results);
            // setTotalRecord(response?.data?.response?.count);
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

    const getUsers = () => {
        console.log("getUsers");
        try {
            showLoader();
            // const response = await getUsers(page, pageSize, search, currentTab);
            // setUsers(response?.data?.response?.results);
            // setTotalRecord(response?.data?.response?.count);
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

    const getDataByTab = (tab: string) => {
        setCurrentTableTab(tab)
        switch (tab) {
            case TABS_LABEL.PROFILE:
                return null;
            case TABS_LABEL.LOCATIONS:
                getLocations();
                return null;
            case TABS_LABEL.PRODUCTS:
                getProducts();
                return null;
            case TABS_LABEL.USER_ACCESS:
                getUsers();
                return null;
            default:
                return [];
        }
    }

    return (
        <div className='manage-account-content'>
            <Tabs
                tabPosition={"left"}
                style={{ height: "100%", padding: 0 }}
                onChange={tabOnChange}
                activeKey={currentTab}
                items={[
                    {
                        label: (
                            <span className='text-capitalize'>{TABS_LABEL.PROFILE}</span>
                        ),
                        key: TABS_LABEL.PROFILE, children: <PartnerCreateUpdate isUpdateForm={true} />, icon: <BarsOutlined />
                    },
                    {
                        label: "Locations", key: "Locations", children:
                            <ListView
                                onSearch={onSearch}
                                tabOnChange={getDataByTab}
                                data={locations}
                                handlePageSizeChange={handlePageSizeChange}
                                page={page}
                                search={search}
                                setPage={setPage}
                                loading={isLoading}
                                noRecordText={TABLE_NO_RECORDS_TEXT.LOCATIONS}
                                columns={LocationColumns({ partnerID: partnerID })}
                                createPath={`/Partner/${partnerID}/ManageAccount/createLocation`}
                                pageSize={pageSize}
                                totalRecord={locations.length}
                                getRecords={getLocations}
                                currentTab={currentTableTab}
                                scroll={500}
                            />,
                        icon: <EnvironmentOutlined />
                    },
                    {
                        label: (
                            <span className='text-capitalize'>{TABS_LABEL.PRODUCTS}</span>
                        ),
                        key: TABS_LABEL.PRODUCTS, children: <ListView
                            onSearch={onSearch}
                            tabOnChange={getDataByTab}
                            data={products}
                            handlePageSizeChange={handlePageSizeChange}
                            page={page}
                            search={search}
                            setPage={setPage}
                            loading={isLoading}
                            noRecordText={TABLE_NO_RECORDS_TEXT.LOCATIONS}
                            columns={ProductsColumns({ partnerID: partnerID })}
                            createPath={`/Partner/${partnerID}/ManageAccount/createProduct`}
                            pageSize={pageSize}
                            totalRecord={products.length}
                            getRecords={getProducts}
                            currentTab={currentTableTab}
                            scroll={500}
                        />, icon: <BarsOutlined />
                    },
                    {
                        label: (
                            <span className='text-capitalize'>{TABS_LABEL.USER_ACCESS}</span>
                        ),
                        key: TABS_LABEL.USER_ACCESS, children: <ListView
                            onSearch={onSearch}
                            tabOnChange={getDataByTab}
                            data={usersData}
                            handlePageSizeChange={handlePageSizeChange}
                            page={page}
                            search={search}
                            setPage={setPage}
                            loading={isLoading}
                            noRecordText={TABLE_NO_RECORDS_TEXT.USERS}
                            columns={UsersColumns({ partnerID: partnerID })}
                            createPath={`/Partner/${partnerID}/ManageAccount/createUser`}
                            pageSize={pageSize}
                            totalRecord={usersData.length}
                            getRecords={getUsers}
                            currentTab={currentTableTab}
                            scroll={500}
                        />, icon: <UsergroupAddOutlined />
                    },
                ]}
            />
        </div>
    )
}



export default ManageAccount