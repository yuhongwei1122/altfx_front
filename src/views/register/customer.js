import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Steps, Button, Divider, Icon, Alert } from 'antd';
import axios from 'axios';
import Step1Form from './step1';
import Step2Form from './step2';
import Step3Form from './step3';
import './customer.css';

const Step = Steps.Step;

class CustomerForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            current: 2,
            formdata: {}
        }
    };
    handleNext = (params) => {
        const current = this.state.current + 1;
        const formdata = this.state.formdate;
        this.setState({
            current: current,
            formdata: {...formdata,...params}
        });
        if(current === 3){//代表已经完成注册
            console.log("提交注册信息");
            const data = {...formdata,...params}
            if(data.commission_model == 'STP'){
                if(Number(data.extra_fee) === 1){//有手续费
                    data.commission_model = data.commission_model + (Number(data.extra_amount)/10);
                }
            }else{
                if(Number(data.extra_fee) === 1){//有手续费
                    data.commission_model = data.commission_model + ((Number(data.extra_amount)/10)+1);
                }else{
                    data.commission_model = data.commission_model + "1";
                }
            }
            data.birthday = data.birthday.formate("yyyy-MM-dd");
            axios.post('/api/register/apply',data)
            .then((res) => {
                if(res.error.returnCode === 0){
                    this.props.history.push("/confirm/0");
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
            this.props.history.push("/overview");
        }
    };
    handlePrev = () => {
        const current = this.state.current - 1;
        this.setState({ current });
        console.log(this.state.formdate);
    }
    render() {
        const { current } = this.state;
        return (
            <div className="register_box">
                <div style={{margin:"10px"}}><Link to={{pathname:'login'}}><Icon type="left-circle-o" />返回登录</Link></div>
                <div className="register">
                    <div>
                        <Steps current={current} style={{width:"90%",margin:"0 auto"}}>
                            <Step key="first" title="账户信息" />
                            <Step key="second" title="个人信息" />
                            <Step key="third" title="资料上传" />
                        </Steps>
                    </div>
                    <div className="reg_contain">
                        {this.state.current === 0 ?
                            <div className="reg">
                                <Step1Form handleNext={this.handleNext} editData={this.state.formdata}/>
                            </div> : this.state.current === 1 ? 
                            <div>
                                <Step2Form handleNext={this.handleNext} handlePrev={this.handlePrev} editData={this.state.formdata}/>                                
                            </div> : 
                            <div>
                                <Step3Form handleNext={this.handleNext} handlePrev={this.handlePrev} editData={this.state.formdata}/>  
                            </div>
                        }
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
export default CustomerForm;