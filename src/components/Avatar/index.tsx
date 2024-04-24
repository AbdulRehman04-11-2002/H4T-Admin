import React from "react";
import { Avatar as AntAvatar } from "antd";
import CustomPopover from "../Popover/Index";

interface Props {
    avatarClickHandler: () => void;
    ME: any
}

const Avatar: React.FC<Props> = ({ avatarClickHandler, ME }) => {

    return (
        <CustomPopover
            trigger="hover"
            content={<div>
                {ME?.user?.name ? <p className="m-0 user-info-header">Name : {ME?.user?.name}</p> : ""}
                {ME?.user?.email ? <p className="m-0 user-info-header">Email : {ME?.user?.email}</p> : ""}
                {ME?.user?.role ? <p className="m-0 user-info-header">Role : {ME?.user?.role}</p> : ""}
            </div>}
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
        </CustomPopover>
    );
};

export default Avatar;
