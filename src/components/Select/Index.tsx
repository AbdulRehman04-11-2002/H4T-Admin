import React from 'react';
import { Select } from 'antd';
const { Option } = Select;

interface Props {
    options: any[],
    handleDropDown: ((val: string) => void) | undefined;
    selectedValue: string | undefined;
    placeholder: string;
}

const Dropdown: React.FC<Props> = ({ options, handleDropDown, selectedValue, placeholder }) => {
    return (
        <Select
            allowClear
            placeholder={placeholder}
            style={{width: '100%', position:"relative"}}
            onChange={handleDropDown}
            value={selectedValue}
        >
            {options.map((option) => (
                <Option key={option.id} value={option.id}>
                    {option.name}
                </Option>
            ))}
        </Select>
    );
};

export default Dropdown;