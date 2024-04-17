import { Checkbox, Form, TimePicker } from "antd";
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { useTranslation } from "react-i18next";

interface TableColumnProps {
    handleOperatingHoursChange: (timeString: string | string[], index: number, dayName: string) => void;
    onCheckBoxChange: (e: any, Day: string, index: number) => void;
    ERRORS: any;
}

export const OperatingHours = ({ handleOperatingHoursChange, onCheckBoxChange, ERRORS }: TableColumnProps) => {
    const { t } = useTranslation();
    const LABELS: any = t("LABELS", { returnObjects: true });
    const timeFormat = "HH:mm";

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
                <div className='fontWeight-semiBold'><Checkbox checked={record.status === "ENABLED" ? true : false} onChange={(e) => onCheckBoxChange(e, record.DAY, record.index)}></Checkbox></div>
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
                <div className='fontWeight-semiBold'>{record.day}</div>
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
                            key={record.index + "startTime"}
                            name={"startTime" + record.day}
                            style={{ margin: 0 }}
                            rules={[{ required: record.status === "ENABLED" && record.startTime === "" ? true : false, message: ERRORS.START_TIME }]}
                        >
                            <TimePicker
                                disabled={record.status === "ENABLED" ? false : true}
                                onChange={(time: Dayjs, timeString: string | string[]) => handleOperatingHoursChange(timeString, record.index, "startTime")}
                                defaultValue={record.startTime ? dayjs(record.startTime, timeFormat) : null}
                                format={timeFormat}
                                style={{ borderRadius: 0 }}
                                key={record.index + "startTime"}
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
            render: (_: any, record: any) => {
                return (
                    <div className='fontWeight-semiBold'>
                        <Form.Item
                            key={record.index + "endTime"}
                            name={"endTime" + record.day}
                            style={{ margin: 0 }}
                            rules={[{ required: (record.status === "ENABLED" && record.endTime === "") ? true : false, message: ERRORS.END_TIME }]}
                        >
                            <TimePicker
                                onChange={(time: Dayjs, timeString: string | string[]) => handleOperatingHoursChange(timeString, record.index, "endTime")}
                                defaultValue={record.endTime ? dayjs(record.endTime, timeFormat) : null}
                                format={timeFormat}
                                style={{ borderRadius: 0 }}
                                key={record.index + "endTime"}
                                disabled={record.status === "ENABLED" ? false : true}
                            />
                        </Form.Item></div>
                )
            },
        },
        {
            title: (
                <strong className='text-center sp-color-table-header text-capitalize'>
                    {LABELS.BREAK_START}
                </strong>
            ),
            dataIndex: "breakStart",
            width: "21%",
            showSorterTooltip: false,
            render: (_: any, record: any) => (
                <div className='fontWeight-semiBold'>
                    <Form.Item
                        key={record.index}
                        name={"breakStart" + record.day}
                        style={{ margin: 0 }}
                        rules={[{ required: record.status === "ENABLED" && record.breakStart === "" ? true : false, message: ERRORS.BREAK_START }]}
                    >
                        <TimePicker
                            onChange={(time: Dayjs, timeString: string | string[]) => handleOperatingHoursChange(timeString, record.index, "breakStart")}
                            defaultValue={record.breakStart ? dayjs(record.breakStart, timeFormat) : null}
                            format={timeFormat}
                            style={{ borderRadius: 0 }}
                            key={record.index + "breakStart"}
                            disabled={record.status === "ENABLED" ? false : true}
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
            dataIndex: "breakEnd",
            width: "21%",
            showSorterTooltip: false,
            render: (_: any, record: any) => (
                <div className='fontWeight-semiBold'>
                    <Form.Item
                        key={record.index}
                        name={"breakEnd" + record.day}
                        style={{ margin: 0 }}
                        rules={[{ required: record.status === "ENABLED" && record.breakEnd === "" ? true : false, message: ERRORS.BREAK_END }]}
                    >
                        <TimePicker
                            onChange={(time: Dayjs, timeString: string | string[]) => handleOperatingHoursChange(timeString, record.index, "breakEnd")}
                            defaultValue={record.breakEnd ? dayjs(record.breakEnd, timeFormat) : null}
                            format={timeFormat}
                            style={{ borderRadius: 0 }}
                            key={record.index + "breakEnd"}
                            disabled={record.status === "ENABLED" ? false : true}
                        />
                    </Form.Item></div>
            ),
        },

    ]
};
