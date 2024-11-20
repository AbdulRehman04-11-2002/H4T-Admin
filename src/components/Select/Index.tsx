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
            showSearch
            filterOption={(input, option)=>{
            const label = option?.label;
            return typeof label === 'string' && label.toLowerCase().includes(input.toLowerCase());
            }}
            allowClear
            placeholder={placeholder}
            style={{width: '100%', position:"relative"}}
            onChange={handleDropDown}
            value={selectedValue}
        >
            {options.map((option) => (
                <Option key={option.id} value={option.id} label={option.name}>
                    {option.name}
                </Option>
            ))}
        </Select>
    );
};

export default Dropdown;