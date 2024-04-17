import moment from "moment";
import { DatabaseOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";

interface TableColumnProps {
    LABELS: {
        REGISERED_NAME: string;
        SERVICES: string;
        CONTACT_PERSON: string;
        CITY: string;
    };
    showLoader: () => void;

}

export const PartnerTableColumns = ({ LABELS, showLoader }: TableColumnProps) => {
    return [
        {
            title: (
                <strong className='text-center sp-color-table-header text-capitalize'>
                </strong>
            ),
            key: "logo",
            dataIndex: "logo",
            showSorterTooltip: false,
            render: (_: any, record: any) => {

                return (
                    <div className='fontWeight-semiBold'><DatabaseOutlined /></div>
                )
            },
        },

        {
            title: (
                <strong className='text-center sp-color-table-header text-capitalize'>
                    {LABELS.REGISERED_NAME}
                </strong>
            ),
            dataIndex: "name",
            key: "name",
            showSorterTooltip: false,
            sorter: (a: any, b: any) =>
                moment(a.name).isAfter(b.name) ? 1 : -1,
            render: (_: any, record: any) => (
                <div className='fontWeight-semiBold'>
                    {
                        <Link onClick={showLoader} to={`/partner/${record?.id}/manageaccount`}>{record?.name}</Link>
                    }
                </div>
            ),
        },
        {
            title: (
                <strong className='text-center sp-color-table-header text-capitalize'>
                    {LABELS.SERVICES}
                </strong>
            ),
            dataIndex: "SERVICES",
            showSorterTooltip: false,
            // sorter: (a: any, b: any) => a.SERVICES.localeCompare(b.SERVICES),
            render: (_: any, record: any) => (
                <div className='fontWeight-semiBold'>{
                    record?.services?.map((service: any, index: number) => {
                        return (
                            service?.service?.name + (index === record?.services?.length - 1 ? '' : ',')
                        )

                    })
                }</div>
            ),
        },
        {
            title: (
                <strong className='text-center sp-color-table-header text-capitalize'>
                    {LABELS.CONTACT_PERSON}
                </strong>
            ),
            dataIndex: "contractPerson",
            key: "contractPerson",
            showSorterTooltip: false,
            sorter: (a: any, b: any) => a.contactPerson.localeCompare(b.contactPerson),
            render: (_: any, record: any) => (
                <div className='fontWeight-semiBold'>{record?.contactPerson}</div>
            ),
        },
        {
            title: (
                <strong className='text-center sp-color-table-header text-capitalize'>
                    {LABELS.CITY}
                </strong>
            ),
            dataIndex: "CITY",
            key: "CITY",
            showSorterTooltip: false,
            sorter: (a: any, b: any) => a.registeredCity?.name.localeCompare(b.registeredCity?.name),
            render: (_: any, record: any) => (
                <div className='fontWeight-semiBold'>{record?.registeredCity?.name}</div>
            ),
        },

    ]
};
