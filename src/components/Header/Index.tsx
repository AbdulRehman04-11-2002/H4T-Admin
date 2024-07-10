import React from 'react';
import { Button, Image, Layout, Popconfirm, PopconfirmProps } from 'antd';
import Avatar from '../Avatar';
import Logo from '../../assets/images/Health4Travel-logo.png';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu } from "antd";

const { Header } = Layout;
interface HeaderCompProps {
    logOutClickHandler: () => void;
    ME: any
}

const AppHeader: React.FC<HeaderCompProps> = ({ logOutClickHandler, ME }) => {
    const { t } = useTranslation();
    const MENULABEL: any = t("MENULABEL", { returnObjects: true });
    const location = useLocation();
    const selectedKey = location.pathname;

    const confirm: PopconfirmProps['onConfirm'] = () => {
        logOutClickHandler();

    };

    return (
        <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F9C510' }}>
            <div style={{ display: "flex", alignItems: "center" }}>
                <Link to='/'>
                    <Image
                        src={Logo}
                        className='App-logo'
                        style={{
                            objectFit: "contain",
                            width: "100%",
                            height: "100%",
                            maxHeight: 40,
                        }}
                        alt='logo'
                        preview={false}
                    />
                </Link>
                <Menu style={{ backgroundColor: "#f9c510" }} mode="horizontal" selectedKeys={[selectedKey]}>
                    <Menu.Item key="/">
                        <Link to="/">{MENULABEL.MANAGE_ACCOUNT}</Link>
                    </Menu.Item>
                    <Menu.Item key="/planning">
                        <Link to="/planning">{MENULABEL.PLANNING}</Link>
                    </Menu.Item>
                </Menu>
            </div>
            <div style={{ marginLeft: 20, display: 'flex', alignItems: 'center' }}>
                <Popconfirm
                    title="Logout"
                    description="Are you sure to logout?"
                    onConfirm={confirm}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button
                        style={{ marginRight: '20px' }}
                        type="primary"
                    >Logout</Button>
                </Popconfirm>

                <Avatar avatarClickHandler={() => null} ME={ME} />
            </div>
        </Header>
    );
};

export default AppHeader;