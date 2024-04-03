import React from "react";
import { Spin } from "antd";

const Loader: React.FC = () => {
    return (
        <div className='loading-overlay'>
            <Spin size='large' />
        </div>
    );
};

export default Loader;
