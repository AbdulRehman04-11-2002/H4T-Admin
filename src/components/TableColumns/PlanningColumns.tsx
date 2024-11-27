import { Tag } from "antd";
import { Link } from "react-router-dom";
import { getFormattedDateTime, checkPaymentStatus, checkPaymentStatusColor, getOrderProcessStatusColor, getOtrderItemStatus } from '../../helpers/globalFunctions/fetchHandlers';


interface TableColumnProps {
    LABELS: {
        DATE: string;
        PARTNER_NAME: string;
        BOOKING_NUMBER: string;
        NAME: string;
        ORDER_NUMBER: string;
        SERVICE: string;
        LOCATION: string;
        STATUS: string;
        PROCESS: string;
        PAYMENT: string;
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
                    {LABELS.PARTNER_NAME}
                </strong>
            ),
            dataIndex: "order.partner.name",
            sorter: true,
            render: (_: any, record: any) => (
                <div className='fontWeight-semiBold'>
                    {record?.order?.partner?.name}
                </div>
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
                    <Link to={`/order/detail/${record?.order?.id}`}>{record?.order?.code}</Link>
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
                    {LABELS.PROCESS}
                </strong>
            ),
            dataIndex: "status",
            sorter: true,
            render: (_: any, record: any) => (
                <Tag style={{ marginLeft: "20px" }} color={record?.order?.orderStatus === "DRAFT" ? getOrderProcessStatusColor("DRAFT") :getOrderProcessStatusColor(record?.status)}>
                    {record?.order?.orderStatus === "DRAFT" ? "DRAFT" : getOtrderItemStatus(record?.status)}
                </Tag>
            ),
        },
        {
            title: (
                <strong className='text-center sp-color-table-header text-capitalize'>
                    {LABELS.PAYMENT}
                </strong>
            ),
            dataIndex: "order.paymentStatus",
            render: (_: any, record: any) => (
                <Tag style={{ marginLeft: "20px" }} color={checkPaymentStatusColor(checkPaymentStatus(record?.other_services, record?.order?.orderStatus))}>
                    {checkPaymentStatus(record?.other_services, record?.order?.orderStatus)}
                </Tag>
            ),
        },
    ]
};
