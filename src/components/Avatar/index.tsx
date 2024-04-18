import React, { useState } from "react";
import { Avatar as AntAvatar, Popover } from "antd";

interface Props {
    avatarClickHandler: () => void;
    ME: any
}

const Avatar: React.FC<Props> = ({ avatarClickHandler, ME }) => {
    const [visible, setVisible] = useState(false);

    const handleVisibleChange = (visible: boolean) => {
        setVisible(visible);
    };

    return (
        <Popover
            content={<div>
                {ME?.user?.name ? <p>Name : {ME?.user?.name}</p> : ""}
                {ME?.user?.email ? <p>Email : {ME?.user?.email}</p> : ""}
                {ME?.user?.role ? <p>Role : {ME?.user?.role}</p> : ""}
            </div>}
            trigger="hover"
            visible={(ME?.user?.name || ME?.user?.email || ME?.user?.role) ? visible : false}
            onVisibleChange={handleVisibleChange}
        >
            <AntAvatar
                onClick={avatarClickHandler}
                src={ME?.user?.imageUrl}
                size={"large"}
                shape="circle"
                style={{
                    backgroundColor: !ME?.user?.imageUrl ? "#183A59" : "transparent",
                    objectFit: "contain",
                    cursor: "pointer",
                }}
            >
                {ME?.user?.name?.charAt(0)}
            </AntAvatar>
        </Popover>
    );
};

export default Avatar;
