import React, { Component } from 'react';
import { Row, Col, Input, Button, Icon, Select, Tag, message} from 'antd';
import { timingSafeEqual } from 'crypto';
import axios from 'axios';
import config from "../../config";
import copy from 'copy-to-clipboard';
const Option = Select.Option;

class AgentRuleForm extends Component{
    constructor(props){
        super(props);
        this.state = {
            prefix: "",
            url1:"",
            url2:"",
            url3: "",
            userDate:{},
            commission_model: "",
            extra_amount: ""
        };
    };
    CopyFirst = (value) => {
        console.log("复制链接",value);
        copy(value);
        message.success('复制成功，如果失败，请在输入框内手动复制.');
    };
    handleExtraChange = (value) => {
        this.setState({
            extra_amount: value
        });
    };
    handleModelChange = (value)=>{
        this.setState({
            commission_model: value
        });
    };
    createUrl = () => {
        const url3 =  "http:" + this.state.prefix + "/#/register?"+window.btoa(window.encodeURIComponent("unique_code="+this.state.userDate.unique_code + "&commission_model="+this.state.commission_model+"&extra_fee="+this.state.extra_amount));
        this.setState({
            url3: url3
        });
    };
    componentDidMount = () => {
        let env = (process && process.env && process.env.NODE_ENV) || 'production';
        console.log(env);
        const prefix = config[`${env}_upload_url`];
        console.log(prefix);
        let data = {};
        if(sessionStorage.getItem("altfx_user")){
            data = JSON.parse(sessionStorage.getItem("altfx_user"));
        }
        const url1 =  "http:" + prefix + "/#/register?"+window.btoa(window.encodeURIComponent("unique_code="+data.unique_code));
        const url2 =  "http:" + prefix + "/#/register?"+window.btoa(window.encodeURIComponent("unique_code="+data.unique_code + "&commission_model=STP&extra_fee=0"));
        this.setState({
            url1: url1,
            url2: url2,
            prefix: prefix,
            userDate: data
        });
    };
    render(){
        return(
            <div style={{marginTop:30}}>
                <Row gutter={24}>
                    <Col span={5} style={{textAlign:"right",paddingRight:0}}>
                        <label style={{lineHeight:"32px"}}>代理链接：</label>
                    </Col>
                    <Col span={13}>
                        <Input
                            placeholder="链接"
                            prefix={<Icon type="share-alt" />}
                            value={this.state.url1}
                            disabled
                        />
                    </Col>
                    <Col>
                        <Button type="primary" onClick={this.CopyFirst.bind(this,this.state.url1)}>复制</Button>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={5} style={{textAlign:"right",paddingRight:0}}>
                        
                    </Col>
                    <Col span={13}>
                        <p>限制介绍经纪人ID为:{this.state.userDate.unique_code}</p>
                    </Col>
                </Row>
                <Row gutter={24} style={{marginTop:10}}>
                    <Col span={5} style={{textAlign:"right",paddingRight:0}}>
                        <label style={{lineHeight:"32px"}}>代理链接S0：</label>
                    </Col>
                    <Col span={13}>
                        <Input
                            placeholder="链接"
                            prefix={<Icon type="share-alt" />}
                            value={this.state.url2}
                            disabled
                        />
                    </Col>
                    <Col>
                        <Button type="primary" onClick={this.CopyFirst.bind(this,this.state.url2)}>复制</Button>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={5} style={{textAlign:"right",paddingRight:0}}>
                        
                    </Col>
                    <Col span={13}>
                        <p>限制介绍经纪人ID为:{this.state.userDate.unique_code}，点差类型为STP、手续费为$0</p>
                    </Col>
                </Row>
                <Row gutter={24} style={{marginTop:10}}>
                    <Col span={5} style={{textAlign:"right",paddingRight:0}}>
                        <label style={{lineHeight:"32px"}}>自定义链接：</label>
                    </Col>
                    <Col span={10}>
                        <Row gutter={24}>
                            <Col span={4} style={{textAlign:"right",paddingRight:0}}>
                                <label style={{lineHeight:"32px"}}>点差类型：</label>
                            </Col>
                            <Col span={6}>
                                <Select value={this.state.commission_model} onChange={this.handleModelChange.bind(this)}>
                                    <Option value="">请选择点差类型</Option>
                                    <Option value="STP">STP</Option>
                                    <Option value="ECN">ECN</Option>
                                </Select>
                            </Col>
                            <Col span={4} style={{textAlign:"right",paddingRight:0}}>
                                <label style={{lineHeight:"32px"}}>手续费：</label>
                            </Col>
                            <Col span={6}>
                                <Select value={this.state.extra_amount} onChange={this.handleExtraChange.bind(this)}>
                                    <Option value="">请选择点差类型</Option>
                                    <Option value="10">$10</Option>
                                    <Option value="20">$20</Option>
                                    <Option value="30">$30</Option>
                                    <Option value="40">$40</Option>
                                    <Option value="50">$50</Option>
                                </Select>
                            </Col>
                        </Row>
                    </Col>
                    <Col>
                        <Button type="primary" onClick={this.createUrl.bind(this)}>生成链接</Button>
                    </Col>
                </Row>
                <Row gutter={24} style={{marginTop:10}}>
                    <Col span={5} style={{textAlign:"right",paddingRight:0}}>
                    </Col>
                    <Col span={13}>
                        <Input
                            placeholder="链接"
                            prefix={<Icon type="share-alt" />}
                            value={this.state.url3}
                            disabled
                        />
                    </Col>
                    <Col>
                        <Button type="primary" disabled={this.state.url3? false:true} onClick={this.CopyFirst.bind(this,this.state.url3)}>复制</Button>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={5} style={{textAlign:"right",paddingRight:0}}>
                    </Col>
                    <Col span={13}>
                        <p>限制介绍经纪人ID为:{this.state.userDate.unique_code}，点差类型为{this.state.commission_model}、手续费为{this.state.extra_amount}</p>
                    </Col>
                </Row>
            </div>
        )
    }
};
export default AgentRuleForm;
