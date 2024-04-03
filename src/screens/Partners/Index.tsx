import { useContext, useEffect, useState } from 'react';
import { Input, notification } from 'antd';
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
    const TABS_KEY: any = t("TABS_KEY", { returnObjects: true });
    const LABELS: any = t("LABELS", { returnObjects: true });

    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [search, setSearch] = useState<string>("");
    const [totalRecord, setTotalRecord] = useState<number>(0);
    const [currentTab, setCurrentTab] = useState<string>("enabled");
    const [loading, setLoading] = useState<boolean>(false);
    const { isLoading, showLoader, hideLoader } = useContext(LoaderContext) as LoaderContextValue;
    const { success, setSuccess } = useContext(GlobalContext) as GlobalContextProps;

    const [partners, setPartners] = useState<Partner[]>([]);
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

    const onSearch = (value: string) => {
        getAllPartners(1, pageSize, value, currentTab);

        if (success) {
            openToastNotification(
                success,
                "notifications toast-notification-success"
            );
            setSuccess("");
        }
        setSearch(value);
    };

    const tabOnChange = (currentTab: string) => {
        getAllPartners(1, pageSize, search, currentTab);
        setCurrentTab(currentTab.toLowerCase());
        setPage(1);
    };

    const handlePageSizeChange = (current: number = 1, pageSize: number) => {
        setPageSize(pageSize);
        setPage(current);

    };

    useEffect(() => {
        Storage.setTab(TABS_LABEL.PROFILE);
    }, [navigate]);

    useEffect(() => {
        getAllPartners(page, pageSize, search, currentTab);
    }, [page, pageSize]);

    return (
        <div className='partner-content'>
            {isLoading ? (
                <Loader />
            ) : (
                <ListView
                    columns={PartnerTableColumns({ LABELS: LABELS, showLoader: showLoader })}
                    onSearch={onSearch}
                    tabOnChange={tabOnChange}
                    totalRecord={totalRecord}
                    data={partners}
                    handlePageSizeChange={handlePageSizeChange}
                    page={page}
                    search={search}
                    setPage={setPage}
                    loading={loading}
                    noRecordText={TABLE_NO_RECORDS_TEXT.PARTNERS}
                    createPath='/partner/create'
                    currentTab={currentTab}
                    pageSize={pageSize}
                    getRecords={getAllPartners}
                    scroll={500}
                />
            )}
        </div>
    );
}

export default PartnersList;
