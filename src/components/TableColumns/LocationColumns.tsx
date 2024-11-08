import moment from "moment";
import { DatabaseOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Image } from "antd";

interface TableColumnProps {
    partnerID: string;
    partnerName: string;
}

export const LocationColumns = ({ partnerID, partnerName }: TableColumnProps) => {
    const { t } = useTranslation();
    const LABELS: any = t("LABELS", { returnObjects: true });

    return [

        {
            title: (
                <strong className='text-center sp-color-table-header text-capitalize'>
                    Location Image
                </strong>
            ),
            dataIndex: "REGISTERED_NAME",
            showSorterTooltip: false,
            render: (_: any, record: any) => (
                <div className='fontWeight-semiBold'>
                    {record.imageUrl ? <Image
                        width={40}
                        src={record.imageUrl}
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
            dataIndex: "code",
            showSorterTooltip: false,
            sorter: (a: any, b: any) =>
                moment(a.code).isAfter(b.code) ? 1 : -1,
            render: (_: any, record: any) => (
                <div className='fontWeight-semiBold'>{record?.code}</div>
            ),
        },
        {
            title: (
                <strong className='text-center sp-color-table-header text-capitalize'>
                    {LABELS.NAME}
                </strong>
            ),
            dataIndex: "name",
            showSorterTooltip: false,
            sorter: (a: any, b: any) => a.name.localeCompare(b.name),
            render: (_: any, record: any) => (
                <div className='fontWeight-semiBold'><Link to={`/partner/${partnerID}/manageAccount/${partnerName}/${record?.id}/${record?.name.replace(/\s+/g, '-')}/updateLocation`}>{record?.name}</Link> </div>
            ),
        },
        {
            title: (
                <strong className='text-center sp-color-table-header text-capitalize'>
                    {LABELS.CITY}
                </strong>
            ),
            dataIndex: "CITY",
            showSorterTooltip: false,
            sorter: (a: any, b: any) => a?.city?.name?.localeCompare(b?.city?.name),
            render: (_: any, record: any) => (
                <div className='fontWeight-semiBold'>{record?.city?.name}</div>
            ),
        },

    ]
};
