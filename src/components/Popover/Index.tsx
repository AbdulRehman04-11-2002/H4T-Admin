import { useState } from "react";

interface CustomPopoverProps {
    content: React.ReactNode;
    trigger: "hover" | "click";
    children: React.ReactNode;
}

const CustomPopover: React.FC<CustomPopoverProps> = ({ content, trigger, children }) => {
    const [visible, setVisible] = useState(false);

    const handleMouseEnter = () => {
        if (trigger === "hover") {
            setVisible(true);
        }
    };

    const handleMouseLeave = () => {
        if (trigger === "hover") {
            setVisible(false);
        }
    };

    const handleClick = () => {
        if (trigger === "click") {
            setVisible(!visible);
        }
    };

    return (
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            style={{ position: "relative", display: "inline-block" }}
        >
            {children}
            {visible && (
                <div
                    style={{
                        position: "absolute",
                        top: 50,
                        right: 0,
                        backgroundColor: "white",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                        padding: "10px",
                        borderRadius: "4px",
                        zIndex: 999,
                        width: "max-content",
                    }}
                >
                    {content}
                </div>
            )}
        </div>
    );
};

export default CustomPopover;
