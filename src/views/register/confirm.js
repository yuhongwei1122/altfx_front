import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Divider, Icon } from 'antd';
import './customer.css';
import Logo from './logo-blue.png';

class ConfirmForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            status: 0
        }
    };
    getResultText = () => {
        switch(Number(this.state.status)){
            case 0:
                return (<div>我们会在1-2个工作日内审核您的注册信息，审核结果会发送至您的邮箱中，请注意查收！</div>)
                break;
            case 1:
                return (<div>您的安全验证链接已失效，请联系我们的客服人员重新给您发送安全验证邮件，谢谢您的理解与配合！</div>)
                break;
            case 2:
                return (<div>您的申请我们已经收到，我们会在1-2个工作日内审核您的注册信息，审核结果会发送至您的邮箱中，请注意查收！</div>)
                break;
            case 3:
                return (<div>用户不存在，请重新申请注册！</div>)
                break;
            case 4:
                return (<div>数据库存储失败，请联系客服</div>)
                break;
            case 5:
                return (<div>激活出错，请联系客服，谢谢！</div>)
                break;
            default:
                break;
        }
    };
    toLogin = () => {
        this.props.history.push("/login");
    };
    componentWillMount(){
        this.setState({
            status: this.props.match.params.status || "0",
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
                        <div className="confirm_icon">
                            {
                                (Number(this.state.status) === 0 || Number(this.state.status) === 2) ?
                                <Icon className="success" type="check-circle" /> :
                                <Icon className="error" type="close-circle" /> 
                            }
                        </div>
                        <div className="result_text">
                            {
                                (Number(this.state.status) === 0 || Number(this.state.status) === 2) ?
                                <h2>成功</h2> :
                                <h2>提示</h2>
                            }
                            {this.getResultText()}
                            <Button style={{marginTop:20}} onClick={this.toLogin} type="primary">回到首页</Button>
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
export default ConfirmForm;