import React, { Component } from 'react';
import axios from 'axios';
import { Layout, Menu, Dropdown, Icon, Avatar, Notification, Modal } from 'antd';
import {Link} from 'react-router-dom';
import "./header.css";
import JdbSider from '../sider/sider';
import menuData from '../sider/_nav';
import Auth from '../auth/auth';
import UpdatePasswordForm from './password';
const { Header } = Layout;

class JdbHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            poName: "",
            collapsed: true,
            passwordVisabled: false
        };
    };
    
    onMenuClick = () => {
        sessionStorage.setItem("altfx_user","");
        axios.post('/api/login/out').then((res) => {
            if(Number(res.error.returnCode) === 0){
                window.location.href = "/";
            }else{
                window.location.href = "/"
            }
        });
    };
    handleClick = (e) => {
        console.log('click ', e);
        if(e.key === 'forget'){
            this.forgetClick();
        }else if(e.key === 'logout'){
            this.onMenuClick();
        }else{
            console.log("other");
            window.location.href = "/#/baseinfo"
            // this.props.history.push("/baseinfo"); 
        }
    };
    forgetClick = () => {
        console.log("zheli");
        this.setState({
            passwordVisabled: true
        });
    };
    handleUpdateCancel = () => {
        this.setState({
            passwordVisabled: false
        });
    };
    handleUpdateOk = () => {
        this.setState({
            passwordVisabled: false
        });
        Notification.success({
            message: '成功',
            description: '密码修改成功，下次登录请使用新密码',
        });
    };
    componentDidMount(){
        if(sessionStorage.getItem("altfx_user")){
            this.setState({
                poName: JSON.parse(sessionStorage.getItem("altfx_user")) ? JSON.parse(sessionStorage.getItem("altfx_user")).username : "altfx"
            });
        }else{
            this.setState({
                poName: "altfx"
            });
        }
        
    };
    render() {
        const menu = (
            <Menu className="menu" onClick={this.handleClick}>
                <Menu.Item key="base">
                    <Icon type="eye"/>我的信息
                </Menu.Item>  
                <Menu.Item key="forget">
                    <Icon type="edit"/>修改密码
                </Menu.Item>
                <Menu.Item key="logout">
                    <Icon type="logout" />退出登录
                </Menu.Item>
            </Menu>
        );
        return (
            <Header className="header" style={{position: 'fixed',width:"100%",zIndex:"100",height:'60px', lineHeight:'60px', background: '#001529', padding: 0 }} >  
                <div style={{float:"left"}}>
                    <JdbSider 
                        menuData={menuData}
                        collapsed={this.state.collapsed}
                        location={this.props.location}
                        Authorized={Auth}
                    />
                </div>
                <div className="right">    
                    <Dropdown overlay={menu}>
                        <span className="action account">
                        <Avatar size="small" className="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" />
                        <span className="name">{this.state.poName}</span>
                        </span>
                    </Dropdown>  
                </div>
                <Modal
                    visible={this.state.passwordVisabled}
                    title="修改密码"
                    confirmLoading={this.state.confirmLoading}
                    footer={null}
                    >
                    <div>
                        <UpdatePasswordForm handleUpdateCancel={this.handleUpdateCancel} handleUpdateOk={this.handleUpdateOk}/>
                    </div>
                </Modal>
            </Header>
        );
    }

}
export default JdbHeader;