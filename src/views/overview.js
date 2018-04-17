import React, { Component } from 'react';
import {Calendar } from 'antd';

class Overview extends Component {
    constructor(props){
        super(props);
        this.state = {
        }
    };
    render() {
        return (
            <div className="overview" style={{marginTop:30}}>
                <p style={{fontSize:"20px",textAlign:"center"}}>亲爱的，欢迎登录ALTFX外汇平台,如有问题请联系技术支持～</p>
                <div style={{marginTop:10}}>
                    <Calendar/>
                </div>
            </div>
        );
    }
};
export default Overview;