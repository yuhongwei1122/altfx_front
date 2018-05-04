import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Steps, Divider, Icon, Alert, message } from 'antd';
import axios from 'axios';
import qs from 'qs';
import moment from 'moment';
import Step5Form from './step5';
import './customer.css';
import { format } from 'path';
import { stat } from 'fs';
import Logo from './logo-blue.png';

const Step = Steps.Step;

class DemoMt4Form extends Component {
    constructor(props){
        super(props);
    };
    handleSubmit = (params) => {
        axios.post('/api/register/apply',qs.stringify({
            account_type: 3,
            ...params
        }))
        .then((res) => {
            if(Number(res.error.returnCode) === 0){
                if(res.error.returnCode === 0){
                    this.props.history.push("/confirm/2");
                }else{
                    this.setState({
                        submiting: false
                    });
                    return (<Alert
                        message="Error"
                        description={res.error.returnUserMessage}
                        type="error"
                        showIcon
                    />)
                }
            }else{
                message.error(res.error.returnUserMessage);
            }
        }).catch((error) => {
            this.setState({
                submiting: false
            });
            return (<Alert
                message="Error"
                description={error}
                type="error"
                showIcon
            />)
        });
    };
    render() {
        return (
            <div className="register_box">
                <div className="register_head">
                    <img alt="" className="logo" src={Logo}/>
                    <Link className="link" to={{pathname:'login'}}><Icon type="left-circle-o" />返回登录</Link>
                </div>
                <div className="register">
                    <div className="reg_contain">
                        <div className="reg">
                            <Step5Form handleSubmit={this.handleSubmit}/>
                        </div>
                        <Divider orientation="left"><Icon type="info-circle-o"></Icon>风险提示</Divider>
                        <div className="reg_note">
                            <p>所有外汇及差价合约交易都会对您的资本带来高风险的巨额收益或者亏损，因此可能不适合所有投资者。您应当确保已理解其中所涉及的所有风险并已经谨慎评估适宜自身的财务状况。若有需要，请咨询金融专家寻求合理建议。</p>
                            <p>网站或任何本网站之链接上的服务、资讯、观点、新闻、研究、分析、价格或其他信息仅作为一般性市场参考信息，不代表任何投资建议。您使用网站的各类服务及内容是基于自己的判断及完全独立责任。ALT-FX不承担任何直接或间接地使用或者依赖上述信息而关联的获利、损失或者赔偿责任。</p>
                        </div>
                    </div>
                </div>
                <div className="reg_footer">©2018 ALT-FX LIMITED ALL RIGHTS RESERVED</div>
            </div>
        );
    }
};
export default DemoMt4Form;