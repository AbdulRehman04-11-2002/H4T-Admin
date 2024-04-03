import moment from "moment";
import { DatabaseOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
interface StatusOrderMap {
    [key: string]: number;
}

interface TableColumnProps {
    partnerID: string;
}

export const ProductsColumns = ({partnerID }: TableColumnProps) => {
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
                moment(a.CODE).isAfter(b.CODE) ? 1 : -1,
            render: (_: any, record: any) => (
                <div className='fontWeight-semiBold'>{record?.CODE}</div>
            ),
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
            sorter: (a: any, b: any) => a.NAME.localeCompare(b.NAME),
            render: (_: any, record: any) => (
                <div className='fontWeight-semiBold'><Link to={`/partner/${partnerID}/manageaccount/${record?.id}/updateproduct`}>{record?.NAME}</Link></div>
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
            sorter: (a: any, b: any) => a.CONTACT_PERSON.localeCompare(b.CONTACT_PERSON),
            render: (_: any, record: any) => (
                <div className='fontWeight-semiBold'>{record?.SERVICE_TYPE}</div>
            ),
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
            sorter: (a: any, b: any) => a.CONTACT_PERSON.localeCompare(b.CONTACT_PERSON),
            render: (_: any, record: any) => (
                <div className='fontWeight-semiBold'>{record?.LAST_MODIFIED}</div>
            ),
        },

    ]
};
