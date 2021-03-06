import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Steps, Divider, Icon, Alert, message } from 'antd';
import axios from 'axios';
import qs from 'qs';
import moment from 'moment';
import Step1Form from './step1';
import Step2Form from './step2';
import Step3Form from './step3';
import './customer.css';
import { format } from 'path';
import Logo from './logo-blue.png';

const Step = Steps.Step;

class CustomerForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            current: 0,
            formdata: {},
            unique_code: ""
        }
    };
    handleNext = (params) => {
        const current = this.state.current + 1;
        let formdata = this.state.formdata;
        formdata = {...formdata,...params};
        console.log(formdata);
        // let tempdata = Object.assign(temp, ...formdata);
        this.setState({
            current: current,
            formdata: formdata
        });
        if(current === 3){//代表已经完成注册
            // console.log("提交注册信息");
            console.log("新数据",formdata);
            if(formdata.commission_model === 'STP'){
                if(Number(formdata.extra_fee) === 1){//有手续费
                    formdata.commission_model = formdata.commission_model + (Number(formdata.extra_amount)/10);
                }
            }else{
                if(Number(formdata.extra_fee) === 1){//有手续费
                    formdata.commission_model = formdata.commission_model + ((Number(formdata.extra_amount)/10)+1);
                }else{
                    formdata.commission_model = formdata.commission_model + "1";
                }
            }
            console.log("提交的数据",formdata);
            // data.birthday = data.birthday.format("yyyy-MM-dd");
            axios.post('/api/register/apply',qs.stringify(formdata))
            .then((res) => {
                if(Number(res.error.returnCode) === 0){
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
            this.props.history.push("/overview");
        }
    };
    handlePrev = () => {
        const current = this.state.current - 1;
        this.setState({ current });
        console.log(this.state.formdata);
    };
    GetQueryString = (name) =>{
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = this.props.location.search.substr(1).match(reg);
        if(r !== null)
            return  unescape(r[2]);
        else {
            return "";
        } 
    }
    componentWillMount(){
        console.log(this.props);
        if(this.props.location.search){
            this.setState({
                formdata: {
                    account_type:1,
                    invite_code: this.GetQueryString("unique_code") || "",
                    commission_model: this.GetQueryString("commission_model") || "STP",
                    extra_fee: this.GetQueryString("extra_fee") || "0",
                    extra_amount: this.GetQueryString("extra_amount") || "10",
                    invitecodeFlag: this.GetQueryString("unique_code") != "" ? true : false,
                    modelFlag: this.GetQueryString("commission_model") != "" ? true : false,
                    extrafeeFlag: this.GetQueryString("extra_fee") != "" ? true : false,
                    extraamountFlag: this.GetQueryString("extra_amount") != "" ? true : false,
                }
            });
        }else{
            this.setState({
                formdata: {
                    invitecodeFlag: false,
                    modelFlag: false,
                    extrafeeFlag: false,
                    extraamountFlag: false,
                    account_type:1
                }
            });
        }
    };
    render() {
        const { current } = this.state;
        return (
            <div className="register_box">
                <div className="register_head">
                    <img alt="" className="logo" src={Logo}/>
                    <Link className="link" to={{pathname:'login'}}><Icon type="left-circle-o" />返回登录</Link>
                </div>
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