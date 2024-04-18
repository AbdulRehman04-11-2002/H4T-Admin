import React from 'react';
import { Button, Image, Layout, Popconfirm, PopconfirmProps, message, theme } from 'antd';
import Avatar from '../Avatar';
import Logo from '../../assets/images/Health4Travel-logo.png';
import { Link } from 'react-router-dom';

const { Header } = Layout;
interface HeaderCompProps {
    logOutClickHandler: () => void;
    ME: any
}

const AppHeader: React.FC<HeaderCompProps> = ({ logOutClickHandler, ME }) => {
    const confirm: PopconfirmProps['onConfirm'] = () => {
        logOutClickHandler();

    };

    return (
        <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F9C510' }}>
            <div >
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