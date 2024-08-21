import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

interface MinutesDropdownProps {
    value?: number;
    onChange?: (value: number) => void;
    disabled?: boolean
}

const MinutesDropdown: React.FC<MinutesDropdownProps> = ({ value, onChange, disabled }) => {
    const options = Array.from({ length: 13 }, (_, i) => (
        <Option key={i} value={i * 5}>
            {i * 5}
        </Option>
    ));

    return (
        <Select
            value={value}
            onChange={onChange}
            placeholder="minutes"
            disabled={disabled}
        >
            {options}
        </Select>
    );
};

export default MinutesDropdown;
