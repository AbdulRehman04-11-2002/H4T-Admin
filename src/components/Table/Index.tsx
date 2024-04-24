import React from "react";
import { Col, Row, Table as AntTable, Typography, Empty } from "antd";

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
    pageSize: number;
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
    pageSize,
    scroll = 1300,
    noRecordText,
}) => {

        return (
            <>
                <Row>
                    <Col span={24}>
                        <AntTable
                            rowKey={(record) => record.id}
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
                                        pageSize: pageSize || 10,
                                    }
                                    : pagination
                            }
                            locale={{
                                emptyText: (
                                    <Empty
                                        description={
                                            <Text style={{ fontWeight: 600, fontSize: '1.4rem' }}>
                                                {noRecordText ? noRecordText : "LABELS.NO_RECORDS_FOUND"}
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
