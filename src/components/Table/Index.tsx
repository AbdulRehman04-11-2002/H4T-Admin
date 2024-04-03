import React from "react";
import { Col, Row, Table as AntTable, Typography, Empty } from "antd";
import { useTranslation } from "react-i18next";



const { Text } = Typography;
interface TablePropsInterface<T> {
    columns: any[];
    data: any[];
    totalRecord?: number;
    handlePageSizeChange?: (
        page: number,
        pageSize: number,
        search: string
    ) => void;
    pageSizeNum?: number;
    currentPage: number;
    search?: string;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    handleCurrentPageChange?: (
        page: number,
        pageSize: number,
        search: string
    ) => void;
    pagination?: boolean;
    scroll?: number;
    noRecordText?: string;
}

const Table: (
    props: TablePropsInterface<any>
) => React.ReactElement = ({
    columns,
    data,
    totalRecord,
    handlePageSizeChange = () => { },
    currentPage,
    search = "",
    setPage,
    handleCurrentPageChange = () => { },
    pagination = true,
    pageSizeNum,
    scroll = 1300,
    noRecordText,
}) => {
        const { t } = useTranslation();
        const LABELS: any = t("LABELS", { returnObjects: true });


        return (
            <>
                <Row>
                    <Col span={24}>
                        <AntTable

                            bordered={true}
                            size='small'
                            columns={columns}
                            dataSource={data}
                            scroll={{ x: scroll }}
                            pagination={
                                pagination
                                    ? {
                                        showSizeChanger: true,
                                        pageSizeOptions: ["10", "20", "50", "100", "200"],
                                        defaultPageSize: 10,
                                        current: currentPage,
                                        total: totalRecord,
                                        showTotal: (total: number, range: [number, number]) => (
                                            <Text>{`${range[0]}-${range[1]} of ${total} items`}</Text>
                                        ),
                                        responsive: true,
                                        position: ["bottomRight"],
                                        onShowSizeChange: (current, pageSize) => {
                                            console.log("current", current, "pageSize", pageSize);

                                            if (pagination) {
                                                handlePageSizeChange(current, pageSize, search);
                                            }
                                        },
                                        onChange: (current: number, pageSize: number) => {
                                            if (pagination) {
                                                setPage?.(current);
                                                handleCurrentPageChange(current, pageSize, search);
                                            }
                                        },
                                        pageSize: pageSizeNum || 10,
                                    }
                                    : pagination
                            }
                            locale={{
                                emptyText: (
                                    <Empty
                                        description={
                                            <Text style={{ fontWeight: 600, fontSize: '1.4rem' }}>
                                                {noRecordText ? noRecordText : LABELS.NO_RECORDS_FOUND}
                                            </Text>
                                        }
                                    />
                                ),
                            }}
                        />
                    </Col>
                </Row>
            </>
        );
    };

export default Table;
