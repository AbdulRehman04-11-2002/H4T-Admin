import React from "react";
import { Avatar as AntAvatar } from "antd";
import { randomDarkColorCode } from "../../helpers/globalFunctions";

interface Props {
    imageUrl: string;
    name: string;
}

const Avatar: React.FC<Props> = ({ imageUrl, name }) => {
    return (
        <AntAvatar
            src={imageUrl}
            size={"large"}
            shape='circle'
            style={{
                backgroundColor: !imageUrl ? "#183A59" : "transparent",
                objectFit: 'contain'
            }}
        >
            {name.charAt(0)}
        </AntAvatar>
    );
};

export default Avatar;
