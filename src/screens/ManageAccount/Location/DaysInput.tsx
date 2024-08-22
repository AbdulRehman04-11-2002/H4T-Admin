import React from 'react';
import { Input } from 'antd';

interface DaysInputProps {
    value?: number;
    onChange?: (value: number) => void;
    disabled?: boolean
}

const DaysInput: React.FC<DaysInputProps> = ({ value, onChange, disabled }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (val === '' || /^\d+$/.test(val)) {
            onChange?.(val === '' ? 0 : parseInt(val, 10));
        }
    };

    return (
        <Input
            value={value}
            onChange={handleChange}
            placeholder="days"
            disabled={disabled}
        />
    );
};

export default DaysInput;
