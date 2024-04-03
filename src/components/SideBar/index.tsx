import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Layout, Menu, Typography } from "antd";
import { menu } from "../../constants/sidebarMenu";
import { useTranslation } from "react-i18next";

const { Sider } = Layout;
const { Text } = Typography;

const Sidebar: React.FC<any> = ({ collapsed, setCollapsed }) => {
    const [keyValue, setKeyValue] = useState("");
    const location = useLocation();
    const { t } = useTranslation();
    const MENULABEL: any = t("MENULABEL", { returnObjects: true });
    const HEALTH4TRAVEL = t("HEALTH4TRAVEL");

    const onClick = (e: any) => {
        setKeyValue(e.key);
    };

    const appNavigation = (key: string) => {
        setKeyValue(key);
    };

    const mappings = [
        { keyword: "partner", value: MENULABEL.PARTNER, },
        { keyword: "dashboard", value: MENULABEL.DASHBOARD, }
    ];

    useEffect(() => {
        const pathName: string = location.pathname;
        const matchingMapping = mappings.find((mapping) =>
            pathName.includes(mapping.keyword)
        );
        const keyValue = matchingMapping
            ? matchingMapping.value
            : MENULABEL.DASHBOARD;
        setKeyValue(keyValue);
    }, [location.pathname]);

    return (
        <Sider
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            style={{
                background: "grey",
                height: "auto",
                maxHeight: "",
                overflowY: "hidden",
                width: 300,
            }}
        >
            <Link
                to='/'
                style={{
                    height: 32,
                    margin: 16,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Text
                    style={{
                        fontWeight: 600,
                        fontSize: 20,
                        display: !collapsed ? "block" : "none",
                    }}
                >
                    {HEALTH4TRAVEL}
                </Text>
            </Link>
            <Menu
                onClick={onClick}
                style={{ height: "calc(100vh - 9rem)", overflow: "" }}
                theme='dark'
                selectedKeys={[keyValue]}
                mode='inline'
            >
                {menu.map((item, index) => (
                    <Menu.Item key={item.key} onClick={() => appNavigation(item.key)}>
                        <Link to={item.link}>
                            <item.icons />
                            <span style={{ textTransform: "uppercase" }}>{item.name}</span>
                        </Link>
                    </Menu.Item>
                ))}
            </Menu>
        </Sider>
    );
};

export default Sidebar;
