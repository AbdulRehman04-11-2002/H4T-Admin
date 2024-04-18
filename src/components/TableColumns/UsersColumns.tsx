import { DatabaseOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Image } from "antd";

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
                    User image
                </strong>
            ),
            dataIndex: "logo",
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
                    {LABELS.NAME}
                </strong>
            ),
            dataIndex: "name",
            showSorterTooltip: false,
            sorter: (a: any, b: any) => a.name.localeCompare(b.name),
            render: (_: any, record: any) => {

                return (
                    <div className='fontWeight-semiBold'><Link to={`/partner/${partnerID}/manageaccount/${record?.id}/updateuser`}>{record?.name}</Link></div>
                )
            },
        },
        {
            title: (
                <strong className='text-center sp-color-table-header text-capitalize'>
                    {LABELS.EMAIL}
                </strong>
            ),
            dataIndex: "email",
            showSorterTooltip: false,
            sorter: (a: any, b: any) => a.email.localeCompare(b.email),
            render: (email: any, record: any) => (
                <div className='fontWeight-semiBold'>{record.email}</div>
            ),
        },
        {
            title: (
                <strong className='text-center sp-color-table-header text-capitalize'>
                    {LABELS.ROLE}
                </strong>
            ),
            dataIndex: "role",
            showSorterTooltip: false,
            render: (_: any, record: any) => (
                <div className='fontWeight-semiBold'>{
                    record?.user_roles?.map((role: any, index: number) => {
                        return (
                            role?.role?.name + (index === record?.user_roles?.length - 1 ? '' : ',')
                        )

                    })
                }</div>
            ),
        },

    ]
};
