import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

interface HoursDropdownProps {
    value?: number;
    onChange?: (value: number) => void;
    disabled?: boolean
}

const HoursDropdown: React.FC<HoursDropdownProps> = ({ value, onChange, disabled }) => {
    const options = Array.from({ length: 24 }, (_, i) => (
        <Option key={i} value={i}>
            {i}
        </Option>
    ));

    return (
        <Select
            value={value}
            onChange={onChange}
            placeholder="hours"
            disabled={disabled}
        >
            {options}
        </Select>
    );
};

export default HoursDropdown;
