import { Tag } from "antd";
import { Link } from "react-router-dom";
import { getFormattedDateTime, getOrderStatusColor, getOrderStatus } from '../../helpers/globalFunctions/fetchHandlers';


interface TableColumnProps {
    LABELS: {
        DATE: string;
        BOOKING_NUMBER: string;
        NAME: string;
        ORDER_NUMBER: string;
        SERVICE: string;
        LOCATION: string;
        STATUS: string;
    }
}

export const PlanningColumns = ({ LABELS }: TableColumnProps) => {

    return [
        {
            title: (
                <strong className='text-center sp-color-table-header text-capitalize'>
                    {LABELS.DATE}
                </strong>
            ),
            dataIndex: "serviceDateTime",
            key: "date",
            sorter: true,
            render: (_: any, record: any) => (
                <div className='fontWeight-semiBold'>{getFormattedDateTime(record)}</div>
            ),
        },
        {
            title: (
                <strong className='text-center sp-color-table-header text-capitalize'>
                    {LABELS.BOOKING_NUMBER}
                </strong>
            ),
            dataIndex: "order.code",
            sorter: true,
            render: (_: any, record: any) => (
                <div className='fontWeight-semiBold'>
                    {record?.order?.code}
                </div>
            ),
        },
        {
            title: (
                <strong className='text-center sp-color-table-header text-capitalize'>
                    {LABELS.NAME}
                </strong>
            ),
            dataIndex: "visitorFirstName,visitorLastName",
            key: "name",
            sorter: true,
            render: (_: any, record: any) => (
                <div className='fontWeight-semiBold text-capitalize'>{`${record.visitorFirstName} ${record.visitorLastName}`}</div>
            ),
        },
        {
            title: (
                <strong className='text-center sp-color-table-header text-capitalize'>
                    {LABELS.ORDER_NUMBER}
                </strong>
            ),
            dataIndex: "code",
            sorter: true,
            render: (_: any, record: any) => (
                <div className='fontWeight-semiBold'>{record?.code}</div>
            ),
        },
        {
            title: (
                <strong className='text-center sp-color-table-header text-capitalize'>
                    {LABELS.SERVICE}
                </strong>
            ),
            dataIndex: "productName",
            sorter: true,
            render: (_: any, record: any) => (
                <div className='fontWeight-semiBold'>{record?.productName}</div>
            ),
        },
        {
            title: (
                <strong className='text-center sp-color-table-header text-capitalize'>
                    {LABELS.LOCATION}
                </strong>
            ),
            dataIndex: "partnerLocation.name",
            sorter: true,
            render: (_: any, record: any) => (
                <div className='fontWeight-semiBold'>{record?.partnerLocation?.name}</div>
            ),
        },
        {
            title: (
                <strong className='text-center sp-color-table-header text-capitalize'>
                    {LABELS.STATUS}
                </strong>
            ),
            dataIndex: "status",
            sorter: true,
            render: (_: any, record: any) => (
                <Tag style={{ marginLeft: "20px" }} color={getOrderStatusColor(getOrderStatus(record?.status, record?.order?.orderStatus, record?.order?.paymentStatus))}>
                    {getOrderStatus(record?.status, record?.order?.orderStatus, record?.order?.paymentStatus)}
                </Tag>
            ),
        }
    ]
};
