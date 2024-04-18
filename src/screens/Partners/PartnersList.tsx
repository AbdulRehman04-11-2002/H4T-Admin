import { useContext, useEffect, useState } from 'react';
import { PartnerTableColumns } from '../../components/TableColumns/PartnerTableColumns';
import { useNavigate } from 'react-router-dom';
import ListView from '../../components/GeneralListView/Index';
import { Storage } from '../../services/storage';
import { useTranslation } from 'react-i18next';
import { getPartners } from '../../services/api/partner';
import { handleErrorResponse, openToastNotification } from '../../helpers/globalFunctions';
import { ApiError } from '../../services/api/Index';
import Loader from '../../components/Loader';
import { Partner } from '../../interface/Partner';
import { LoaderContext, LoaderContextValue } from '../../context/LoaderContext';
import { GlobalContext, GlobalContextProps } from '../../context/GlobalContext';

function PartnersList() {
    const { t } = useTranslation();
    const TABLE_NO_RECORDS_TEXT: any = t("TABLE_NO_RECORDS_TEXT", { returnObjects: true });
    const TABS_LABEL: any = t("TABS_LABEL", { returnObjects: true });
    const LABELS: any = t("LABELS", { returnObjects: true });

    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [search, setSearch] = useState<string>("");
    const [searchValue, setSearchValue] = useState<string>("");
    const [totalRecord, setTotalRecord] = useState<number>(0);
    const [currentTab, setCurrentTab] = useState<string>("enabled");
    const [partners, setPartners] = useState<Partner[]>([]);
    const { isLoading, showLoader, hideLoader } = useContext(LoaderContext) as LoaderContextValue;
    const { success, setSuccess } = useContext(GlobalContext) as GlobalContextProps;

    const navigate = useNavigate();

    const getAllPartners = async (
        page: number,
        limit: number,
        search: string,
        partnerState: string = currentTab
    ) => {
        showLoader();
        try {
            const response = await getPartners(page, limit, search, partnerState.toUpperCase());
            setPartners(response?.data?.response?.results);
            setTotalRecord(response?.data?.response?.count);
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
        getAllPartners(1, pageSize, search, currentTab);
        setCurrentTab(currentTab.toLowerCase());
        setPage(1);
    };


    useEffect(() => {
        Storage.setTab(TABS_LABEL.PROFILE);
    }, [navigate]);

    useEffect(() => {
        getAllPartners(page, pageSize, search, currentTab);
    }, [page, pageSize, currentTab, search]);

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
        <div className='partner-content'>
            {isLoading ? (
                <Loader />
            ) : (
                <ListView
                    columns={PartnerTableColumns({ LABELS: LABELS, showLoader: showLoader })}
                    tabOnChange={tabOnChange}
                    totalRecord={totalRecord}
                    data={partners}
                    page={page}
                    search={search}
                    setPage={setPage}
                    loading={isLoading}
                    noRecordText={TABLE_NO_RECORDS_TEXT.PARTNERS}
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
                />
            )}
        </div>
    );
}

export default PartnersList;
