import moment from "moment";
import { DatabaseOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Image } from "antd";
interface TableColumnProps {
    partnerID: string;
    partnerName: string;
}

export const ProductsColumns = ({ partnerID, partnerName }: TableColumnProps) => {
    const { t } = useTranslation();
    const LABELS: any = t("LABELS", { returnObjects: true });

    return [

        {
            title: (
                <strong className='text-center sp-color-table-header text-capitalize'>
                    Product Image
                </strong>
            ),
            dataIndex: "REGISTERED_NAME",
            showSorterTooltip: false,
            render: (_: any, record: any) => (
                <div className='fontWeight-semiBold'>
                    {record.imageUrl ? <Image
                        width={40}
                        src={record?.imageUrl}
                    /> : <DatabaseOutlined style={{ width: 40, height: 40 }} />}
                </div>
            ),
        },

        {
            title: (
                <strong className='text-center sp-color-table-header text-capitalize'>
                    {LABELS.CODE}
                </strong>
            ),
            dataIndex: "location",
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
            showSorterTooltip: false,
            sorter: (a: any, b: any) => a.name.localeCompare(b.name),
            render: (_: any, record: any) => (
                <div className='fontWeight-semiBold'><Link to={`/partner/${partnerID}/manageAccount/${partnerName}/${record?.id}/${encodeURIComponent(record?.name).replace(/\s+/g, '-')}/updateProduct`}>{record?.name}</Link></div>
            ),
        },
        {
            title: (
                <strong className='text-center sp-color-table-header text-capitalize'>
                    {LABELS.SERVICE_TYPE}
                </strong>
            ),
            dataIndex: "SERVICE_TYPE",
            showSorterTooltip: false,
            sorter: (a: any, b: any) => a?.partner_service?.service?.name.localeCompare(b?.partner_service?.service?.name),
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
            showSorterTooltip: false,
            sorter: (a: any, b: any) => a?.modifiedAt.localeCompare(b?.modifiedAt),
            render: (_: any, record: any) => (
                <div className='fontWeight-semiBold'>{moment(record?.modifiedAt).format('lll')}</div>
            ),
        },

    ]
};
