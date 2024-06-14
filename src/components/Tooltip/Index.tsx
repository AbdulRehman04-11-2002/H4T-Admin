import React from 'react';
import { Tooltip } from 'antd';
import {
    QuestionCircleOutlined
} from '@ant-design/icons';

interface Props {
    title: string;
}

const TooltipComp: React.FC<Props> = ({ title }) => {
    return (
        <Tooltip overlayClassName='custom-tooltip'
            overlayStyle={{ border: '1px solid #ccc' }}
            placement="topLeft" title={title}>
            <span
                className='ant-input-group-addon'
                style={{ cursor: 'pointer', margin: '5px' }}
            >
                <QuestionCircleOutlined />
            </span>
        </Tooltip>
    );
};

export default TooltipComp;