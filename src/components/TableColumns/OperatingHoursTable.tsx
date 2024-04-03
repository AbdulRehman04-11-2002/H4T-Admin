import { Checkbox, Form, TimePicker } from "antd";
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { useTranslation } from "react-i18next";

interface TableColumnProps {
    handleOperatingHoursChange: (timeString: string | string[], index: number, dayName: string) => void;
    onChange: (e: any, Day: string, index: number) => void;
}

export const OperatingHours = ({ handleOperatingHoursChange, onChange }: TableColumnProps) => {
    const { t } = useTranslation();
    const LABELS: any = t("LABELS", { returnObjects: true });
    const timeFormat = t("timeFormat");

    return [

        {
            title: (
                <strong className='text-center sp-color-table-header text-capitalize'>
                    {/* {LABELS.DAY} */}
                </strong>
            ),
            dataIndex: "checkBoxes",
            width: "8%",
            showSorterTooltip: false,
            render: (_: any, record: any) => (
                <div className='fontWeight-semiBold'><Checkbox onChange={(e) => onChange(e, record.DAY, record.INDEX)}></Checkbox></div>
            ),
        },
        {
            title: (
                <strong className='text-center sp-color-table-header text-capitalize'>
                    {LABELS.DAY}
                </strong>
            ),
            dataIndex: "DAY",
            width: "8%",
            showSorterTooltip: false,
            render: (_: any, record: any) => (
                <div className='fontWeight-semiBold'>{record.DAY}</div>
            ),
        },
        {
            title: (
                <strong className='text-center sp-color-table-header text-capitalize'>
                    {LABELS.START_TIME}
                </strong>
            ),
            dataIndex: "START_TIME",
            width: "21%",
            showSorterTooltip: false,
            render: (_: any, record: any) => {
                return (
                    <div className='fontWeight-semiBold'>
                        <Form.Item
                            key={record.INDEX}
                            name={record.day}
                            style={{ margin: 0 }}
                        >
                            <TimePicker
                                onChange={(time: Dayjs, timeString: string | string[]) => handleOperatingHoursChange(timeString, record.INDEX, "START_TIME")}
                                value={dayjs(record.START_TIME ? record.START_TIME : "00:00", timeFormat)}
                                format={timeFormat}
                                style={{ borderRadius: 0 }}
                                disabled={!record.IS_ENABLED}
                            />
                        </Form.Item></div>
                )
            },
        },
        {
            title: (
                <strong className='text-center sp-color-table-header text-capitalize'>
                    {LABELS.END_TIME}
                </strong>
            ),
            dataIndex: "END_TIME",
            width: "21%",
            showSorterTooltip: false,
            render: (_: any, record: any) => (
                <div className='fontWeight-semiBold'>
                    <Form.Item
                        key={record.INDEX}
                        name={record.day}
                        style={{ margin: 0 }}
                    >
                        <TimePicker
                            onChange={(time: Dayjs, timeString: string | string[]) => handleOperatingHoursChange(timeString, record.INDEX, "END_TIME")}
                            value={dayjs(record.END_TIME ? record.END_TIME : "00:00", timeFormat)}
                            format={timeFormat}
                            style={{ borderRadius: 0 }}
                            disabled={!record.IS_ENABLED}
                        />
                    </Form.Item></div>
            ),
        },
        {
            title: (
                <strong className='text-center sp-color-table-header text-capitalize'>
                    {LABELS.BREAK_START}
                </strong>
            ),
            dataIndex: "BREAK_START",
            width: "21%",
            showSorterTooltip: false,
            render: (_: any, record: any) => (
                <div className='fontWeight-semiBold'>
                    <Form.Item
                        key={record.INDEX}
                        name={record.day}
                        style={{ margin: 0 }}
                    >
                        <TimePicker
                            onChange={(time: Dayjs, timeString: string | string[]) => handleOperatingHoursChange(timeString, record.INDEX, "BREAK_START")}
                            value={dayjs(record.BREAK_START ? record.BREAK_START : "00:00", timeFormat)}
                            format={timeFormat}
                            style={{ borderRadius: 0 }}
                            disabled={!record.IS_ENABLED}
                        />
                    </Form.Item></div>
            ),
        },
        {
            title: (
                <strong className='text-center sp-color-table-header text-capitalize'>
                    {LABELS.BREAK_END}
                </strong>
            ),
            dataIndex: "BREAK_END",
            width: "21%",
            showSorterTooltip: false,
            render: (_: any, record: any) => (
                <div className='fontWeight-semiBold'>
                    <Form.Item
                        key={record.INDEX}
                        name={record.day}
                        style={{ margin: 0 }}
                    >
                        <TimePicker
                            onChange={(time: Dayjs, timeString: string | string[]) => handleOperatingHoursChange(timeString, record.INDEX, "BREAK_END")}
                            value={dayjs(record.BREAK_END ? record.BREAK_END : "00:00", timeFormat)}
                            format={timeFormat}
                            style={{ borderRadius: 0 }}
                            disabled={!record.IS_ENABLED}
                        />
                    </Form.Item></div>
            ),
        },

    ]
};
