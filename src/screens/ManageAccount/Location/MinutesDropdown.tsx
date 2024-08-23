import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

interface MinutesDropdownProps {
    value?: number;
    onChange?: (value: number) => void;
    disabled?: boolean
}

const MinutesDropdown: React.FC<MinutesDropdownProps> = ({ value, onChange, disabled }) => {
    const options = Array.from({ length: 13 }, (_, i) => i * 5)
        .filter(value => value !== 60)
        .map(value => (
            <Option key={value} value={value}>
                {value}
            </Option>
        ));

    return (
        <Select
            value={value || 0}
            onChange={onChange}
            placeholder="minutes"
            disabled={disabled}
        >
            {options}
        </Select>
    );
};

export default MinutesDropdown;
