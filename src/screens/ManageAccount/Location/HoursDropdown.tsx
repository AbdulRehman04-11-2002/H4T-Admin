import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

interface HoursDropdownProps {
    value?: number;
    onChange?: (value: number) => void;
    disabled?: boolean
}

const HoursDropdown: React.FC<HoursDropdownProps> = ({ value, onChange, disabled }) => {
    const str48 = "48"
    const str72 = "72"
    const hrStr = "hour(s)"
    const baseOptions = Array.from({ length: 25 }, (_, i) => (
        <Option key={i} value={i}>
            {i + " " + hrStr}
        </Option>
    ));

    const additionalOptions = [
        <Option key={48} value={48}>
            {str48 + " " + hrStr}
        </Option>,
        <Option key={72} value={72}>
            {str72 + " " + hrStr}
        </Option>,
    ];

    const options = [...baseOptions, ...additionalOptions];

    return (
        <Select
            value={value || 0}
            onChange={onChange}
            placeholder="hours"
            disabled={disabled}
        >
            {options}
        </Select>
    );
};

export default HoursDropdown;
