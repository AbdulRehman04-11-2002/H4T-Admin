import moment from "moment";
import { DatabaseOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
interface StatusOrderMap {
    [key: string]: number;
}

interface TableColumnProps {
    partnerID: string;
    ME: any
}

export const ProductsColumns = ({ partnerID, ME }: TableColumnProps) => {
    const { t } = useTranslation();
    const LABELS: any = t("LABELS", { returnObjects: true });

    return [

        {
            title: (
                <strong className='text-center sp-color-table-header text-capitalize'>
                </strong>
            ),
            dataIndex: "REGISTERED_NAME",
            width: "2%",
            showSorterTooltip: false,
            sorter: (a: any, b: any) =>
                moment(a.REGISTERED_NAME).isAfter(b.REGISTERED_NAME) ? 1 : -1,
            render: (_: any, record: any) => (
                <div className='fontWeight-semiBold'><DatabaseOutlined /></div>
            ),
        },

        {
            title: (
                <strong className='text-center sp-color-table-header text-capitalize'>
                    {LABELS.CODE}
                </strong>
            ),
            dataIndex: "location",
            width: "10%",
            showSorterTooltip: false,
            sorter: (a: any, b: any) =>
                moment(a.code).isAfter(b.code) ? 1 : -1,
            render: (_: any, record: any) => {

                return (
                    <div className='fontWeight-semiBold'>{record?.code}</div>
                )
            },
        },
        {
            title: (
                <strong className='text-center sp-color-table-header text-capitalize'>
                    {LABELS.NAME}
                </strong>
            ),
            dataIndex: "NAME",
            width: "15%",
            showSorterTooltip: false,
            sorter: (a: any, b: any) => a.name.localeCompare(b.name),
            render: (_: any, record: any) => (
                <div className='fontWeight-semiBold'><Link to={`/partner/${partnerID}/manageaccount/${record?.id}/updateproduct`}>{record?.name}</Link></div>
            ),
        },
        {
            title: (
                <strong className='text-center sp-color-table-header text-capitalize'>
                    {LABELS.SERVICE_TYPE}
                </strong>
            ),
            dataIndex: "SERVICE_TYPE",
            width: "10%",
            showSorterTooltip: false,
            render: (_: any, record: any) => {
                return (
                    <div className='fontWeight-semiBold'>{record?.partner_service?.service?.name}</div>
                )
            },
        },
        {
            title: (
                <strong className='text-center sp-color-table-header text-capitalize'>
                    {LABELS.LAST_MODIFIED}
                </strong>
            ),
            dataIndex: "LAST_MODIFIED",
            width: "10%",
            showSorterTooltip: false,
            sorter: (a: any, b: any) => a.lastModified.localeCompare(b.lastModified),
            render: (_: any, record: any) => (
                <div className='fontWeight-semiBold'>{record?.lastModified}</div>
            ),
        },

    ]
};
