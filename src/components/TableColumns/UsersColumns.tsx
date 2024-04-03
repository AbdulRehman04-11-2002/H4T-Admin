import moment from "moment";
import { DatabaseOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface TableColumnProps {
    partnerID: string;
}

export const UsersColumns = ({ partnerID }: TableColumnProps) => {
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
                    {LABELS.NAME}
                </strong>
            ),
            dataIndex: "NAME",
            width: "15%",
            showSorterTooltip: false,
            sorter: (a: any, b: any) => a.NAME.localeCompare(b.NAME),
            render: (_: any, record: any) => {
                
                return (
                    <div className='fontWeight-semiBold'><Link to={`/partner/${partnerID}/manageaccount/${record?.id}/updateuser`}>{record?.NAME}</Link></div>
                )
            },
        },
        {
            title: (
                <strong className='text-center sp-color-table-header text-capitalize'>
                    {LABELS.EMAIL}
                </strong>
            ),
            dataIndex: "EMAIL",
            width: "10%",
            showSorterTooltip: false,
            sorter: (a: any, b: any) => a.EMAIL.localeCompare(b.EMAIL),
            render: (_: any, record: any) => (
                <div className='fontWeight-semiBold'>{record?.EMAIL}</div>
            ),
        },
        {
            title: (
                <strong className='text-center sp-color-table-header text-capitalize'>
                    {LABELS.ROLE}
                </strong>
            ),
            dataIndex: "ROLE",
            width: "10%",
            showSorterTooltip: false,
            sorter: (a: any, b: any) => a.ROLE.localeCompare(b.ROLE),
            render: (_: any, record: any) => (
                <div className='fontWeight-semiBold'>{record?.ROLE}</div>
            ),
        },

    ]
};
