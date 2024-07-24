import { Button, Col, Row, Tabs } from 'antd';
import Search from 'antd/es/input/Search';
import { useNavigate } from 'react-router-dom';
import Table from '../Table/Index';
import { useTranslation } from 'react-i18next';
import Loader from '../Loader';
import React, { ReactNode, useContext } from "react";
import { GlobalContext, GlobalContextProps } from '../../context/GlobalContext';
import { Storage } from '../../services/storage';
interface ListViewProps {
    columns: any[];
    totalRecord: number;
    tabOnChange: (key: string) => void;
    data: any[];
    search: string;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    loading: boolean;
    noRecordText: string;
    createPath: string;
    getRecords: (
        page: number,
        pageSize: number,
        search: string
    ) => void;
    currentTab: string;
    pageSize: number;
    scroll: number;
    isLoading: boolean;
    searchValue: string;
    setSearchValue: React.Dispatch<React.SetStateAction<string>>;
    setPageSize: (pageSize: number) => void;
    page: number;
    setSearch: (value: string) => void;
    tabs: string[],
    handleSorting?: (pagination: any, filters: any, sorter: any) => void;
    filters?: ReactNode;
}

const ListView: React.FC<ListViewProps> = ({ columns, totalRecord, tabOnChange, data, setPage, loading, noRecordText, createPath, getRecords, currentTab, pageSize, scroll, isLoading, setSearchValue, setPageSize, searchValue, page, setSearch, search,
    tabs,
    handleSorting,
    filters
}) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const PLACEHOLDERS: any = t("PLACEHOLDERS", { returnObjects: true });
    const { ME } = useContext(GlobalContext) as GlobalContextProps;

    const onSearch = (value: string) => {
        setSearch(value);
        setSearchValue(value);
    };

    const handlePageSizeChange = (current: number = 1, pageSize: number) => {
        setPageSize(pageSize);
    };

    return (
        <div>
            <div className='mb-2' />
            {isLoading ? <Loader /> :
                <Row justify={"center"} align={"middle"}>
                    {filters ? filters :
                        ME?.user?.user_roles[0]?.role?.id !== 4 || Storage.getTab() === "userAccess"
                            ?
                            <Col xs={23} sm={{ span: 10, offset: 13 }} md={{ span: 10, offset: 13 }} lg={{ span: 6, offset: 17 }} className='search-create-container' >
                                <Row gutter={4} align={"middle"}>
                                    <Col span={8}>
                                        <Button
                                            type='primary'
                                            block
                                            className='text-capitalize'
                                            size='middle'
                                            onClick={() => navigate(createPath)}
                                        >
                                            Create
                                        </Button>
                                    </Col>
                                    <Col span={16}>
                                        <Search
                                            placeholder={PLACEHOLDERS.SEARCH}
                                            onSearch={onSearch}
                                            size="middle"
                                            allowClear={true}
                                            data-testid='search-data'
                                            onChange={(e) => setSearchValue(e.target.value)}
                                            value={searchValue}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                            :
                            <Col span={24} style={{ display: "flex", justifyContent: "right" }}>
                                <Row gutter={4} align={"middle"}>
                                    <Col>
                                        <Search
                                            placeholder={PLACEHOLDERS.SEARCH}
                                            onSearch={onSearch}
                                            size="middle"
                                            allowClear={true}
                                            data-testid='search-data'
                                            onChange={(e) => setSearchValue(e.target.value)}
                                            value={searchValue}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                    }


                    <Col span={24}>
                        <Tabs
                            onChange={tabOnChange}
                            type='card'
                            activeKey={currentTab}
                        >
                            {tabs.map((key) => {
                                return (
                                    <Tabs.TabPane tab={t(`TABS_KEY.${key}`)} key={key}>
                                        <Table
                                            columns={columns}
                                            data={data || []}
                                            totalRecord={totalRecord}
                                            handlePageSizeChange={handlePageSizeChange}
                                            currentPage={page}
                                            search={search}
                                            setPage={setPage}
                                            handleCurrentPageChange={getRecords}
                                            pagination={true}
                                            noRecordText={
                                                loading ? "Loading..." : noRecordText
                                            }
                                            pageSize={pageSize}
                                            handleSorting={handleSorting} />
                                    </Tabs.TabPane>
                                )
                            })}
                        </Tabs>
                    </Col>
                </Row>}
        </div>
    );
};

export default ListView;
