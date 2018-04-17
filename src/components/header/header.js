import React, { Component } from 'react';
import { Layout, Menu, Dropdown, Icon, Avatar } from 'antd';
import "./header.css"
import JdbSider from '../sider/sider';
import menuData from '../sider/_nav';
import Auth from '../auth/auth';
const { Header } = Layout;

class JdbHeader extends Component {
    constructor(){
        super();
        this.state = {
            poName: ""
        };
    };
    componentDidMount(){
        console.log(JSON.parse(sessionStorage.getItem("altfx_user")));
        this.setState({
            poName: JSON.parse(sessionStorage.getItem("altfx_user")) ? JSON.parse(sessionStorage.getItem("altfx_user")).userName : "test"
        });
    };
    onMenuClick = () => {
        sessionStorage.setItem("altfx_user","");
        this.props.history.push("/login");
    };
    render() {
        const menu = (
            <Menu className="menu" onClick={this.onMenuClick}>
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
            </Header>
        );
    }

}
export default JdbHeader;