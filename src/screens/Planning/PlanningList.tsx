import { useContext, useEffect, useState } from 'react';
import { PlanningColumns } from '../../components/TableColumns/PlanningColumns';
import ListView from '../../components/GeneralListView/Index';
import { useTranslation } from 'react-i18next';
import { getOrderItems } from '../../services/api/order';
import { handleErrorResponse, openToastNotification } from '../../helpers/globalFunctions';
import { ApiError } from '../../services/api/Index';
import Loader from '../../components/Loader';
import { Order } from '../../interface/Order';
import { LoaderContext, LoaderContextValue } from '../../context/LoaderContext';
import { GlobalContext, GlobalContextProps } from '../../context/GlobalContext';
import { defaultPlannerSortBy } from '../../constants/contants'
import PlanningFilters from '../Planning/Filters';
import { Moment } from 'moment';


const DEFAULT_FILTERS = {
    searchValue: "",
    startDate: null,
    endDate: null,
    partnerLocationId: null
};

function PlanningList() {
    const { t } = useTranslation();
    const TABLE_NO_RECORDS_TEXT: any = t("TABLE_NO_RECORDS_TEXT", { returnObjects: true });
    const { ME } = useContext(GlobalContext) as GlobalContextProps;
    const LABELS: any = t("LABELS", { returnObjects: true });

    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [search, setSearch] = useState<string>(DEFAULT_FILTERS.searchValue);
    const [searchValue, setSearchValue] = useState<string>(DEFAULT_FILTERS.searchValue);
    const [totalRecord, setTotalRecord] = useState<number>(0);
    const [currentTab, setCurrentTab] = useState<string>("current");
    const [orderItems, setOrderItems] = useState<Order[]>([]);
    const { isLoading, showLoader, hideLoader } = useContext(LoaderContext) as LoaderContextValue;
    const { success, setSuccess } = useContext(GlobalContext) as GlobalContextProps;
    const [dateRange, setDateRange] = useState<[Moment | null, Moment | null]>([null, null]);
    const [selectedLocation, setSelectedLocation] = useState<string | undefined>(undefined);
    const [partnerLocations, setPartnerLocations] = useState<[]>([]);

    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [partnerLocationId, setPartnerLocationId] = useState<number | undefined>();
    const [orderBy, setOrderBy] = useState<string>(defaultPlannerSortBy);

    useEffect(() => {
        let userPartners = ME && ME?.user?.user_partners;
        let partnerLocations = userPartners?.length && userPartners[0]?.partner?.partner_locations;
        if (userPartners?.length) {
            getAllOrderItems(
                page,
                pageSize,
                currentTab,
                search,
                partnerLocationId,
                startDate,
                endDate,
                orderBy
            );
            let allLocations = partnerLocations?.map((loc: any) => ({
                id: loc.id,
                name: loc.name
            }));
            setPartnerLocations(allLocations)
        }
    }, [page, pageSize, orderBy, currentTab, search, partnerLocationId, endDate, ME]);

    useEffect(() => {
        if (success) {
            openToastNotification(
                success,
                "notifications toast-notification-success"
            );
            setSuccess("");
        }
    }, [])

    const getAllOrderItems = async (
        page: number,
        limit: number,
        status: string = currentTab,
        search: string,
        partnerLocationId: number | undefined,
        startDate: string | null,
        endDate: string | null,
        orderBy: string
    ) => {
        showLoader();
        try {
            const response = await getOrderItems(
                page = search ? 1 : page,
                limit,
                status,
                search,
                partnerLocationId,
                startDate,
                endDate,
                orderBy
            );
            setOrderItems(response?.data?.orders?.results);
            setTotalRecord(response?.data?.orders?.count);
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
    };

    const tabOnChange = (currentTab: string) => {
        setCurrentTab(currentTab.toLowerCase());
        setPage(1);
    };

    const handleDropDown = (value: string) => {
        setSelectedLocation(value ? value : undefined);
        setPartnerLocationId(parseInt(value))
        setPage(1);
    };

    const handleDateChange = (dates: [Moment | null, Moment | null], dateStrings: [string, string]) => {
        setDateRange(dates);
        setStartDate(dateStrings[0]);
        setEndDate(dateStrings[1]);
        setPage(1);
    };

    const handleDecendingSortKey = (sortKey: string) => {
        return sortKey.split(',').map((key: string) => {
            return `-${key}`;
        }).join(',');
    };

    const handleSorting = (pagination: any, filters: any, sorter: any) => {
        if (sorter.order) {
            const sortKey = sorter.field;
            const sortOrder = sorter.order === 'ascend' ? sortKey : `${handleDecendingSortKey(sortKey)}`;
            setOrderBy(sortOrder);
            if (pagination.current === page) {
                setPage(1)
            }
        }
    };

    return (
        <div className='partner-content'>
            {isLoading ? (
                <Loader />
            ) : (
                <ListView
                    filters={
                        <PlanningFilters
                            setSearch={setSearch}
                            setSearchValue={setSearchValue}
                            searchValue={searchValue}
                            selectedDateRange={dateRange}
                            dropDownOptions={partnerLocations}
                            handleDateChange={handleDateChange}
                            selectedDropDownVal={selectedLocation}
                            handleDropDown={handleDropDown}
                            setPage={setPage}
                        />}
                    columns={PlanningColumns({ LABELS: LABELS })}
                    tabOnChange={tabOnChange}
                    totalRecord={totalRecord}
                    data={orderItems}
                    page={page}
                    search={search}
                    setPage={setPage}
                    loading={isLoading}
                    noRecordText={TABLE_NO_RECORDS_TEXT.ORDERS}
                    createPath='/partner/create'
                    currentTab={currentTab}
                    pageSize={pageSize}
                    getRecords={() => null}
                    scroll={500}
                    isLoading={isLoading}
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    setPageSize={setPageSize}
                    setSearch={setSearch}
                    handleSorting={handleSorting}
                    tabs={["current", "history"]}
                />
            )}
        </div>
    );
}

export default PlanningList;
