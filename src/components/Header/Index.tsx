import React from 'react';
import { Button, Image, Layout, Popconfirm, PopconfirmProps, message, theme } from 'antd';
import Avatar from '../Avatar';
import Logo from '../../assets/images/Health4Travel-logo.png';
import { Link } from 'react-router-dom';

const { Header } = Layout;

interface HeaderCompProps{
    logOutClickHandler: () => void;

}

const AppHeader: React.FC<HeaderCompProps> = ({logOutClickHandler}) => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const confirm: PopconfirmProps['onConfirm'] = (e) => {
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
                {/* <Button style={{ marginRight: '20px' }} type="primary">Logout</Button> */}
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

                <Avatar imageUrl='' name='Sufyan' />
            </div>
        </Header>
    );
};

export default AppHeader;