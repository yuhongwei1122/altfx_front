import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker, Tag, InputNumber, Spin } from 'antd';
import { timingSafeEqual } from 'crypto';
import moment from 'moment';
import axios from 'axios';
import qs from 'qs';
import sha512 from 'js-sha512';
import config from "../../config";
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const Option = Select.Option;

class RechargeForm extends Component{
    constructor(props){
        super(props);
        this.state = {
            mt4List: [],
            rate: "",
            detail:{},
            rmb:"",
            paydata: {},
            cash_order: ''
        };
    };
    handleGetMT4List = () => {
        axios.post('/api/user/getmt4').then((res) => {
            this.setState({
                mt4List : res.data
            });
        });
    };
    handleMt4Option = () =>{
        const mt4List = this.state.mt4List;
        return mt4List.map((item)=>{
            return <Option key={item.id} value={item.mt4_login}>{item.mt4_name}</Option>
        });
    };
    handleMinVaild = (rule, value, callback) => {
        const form = this.props.form;
        if(value && Number(value) < 50){
            callback('最低入50美金!');
        }else{
            callback();
        }
    };
    getBalance = (value) => {
        const form = this.props.form;
        axios.post('/api/user/user-account',qs.stringify({
            mt4_login: value,
            id: JSON.parse(sessionStorage.getItem("altfx_user")).user_id
        })).then((res) => {
            form.setFieldsValue({
                "balance": res.data.balance,
            });
            form.setFieldsValue({
                "mt4": value,
            });
        });
    };
    getOrder = () => {
        const form = this.props.form;
        axios.post('/api/cash/create-order',qs.stringify({
            cash_type: 1
        })).then((res) => {
            form.setFieldsValue({
                "cash_order": res.data.cash_order,
            });
        });
    };
    getRate = () => {
        axios.post('/api/cash/rate-query',qs.stringify({
            rate_type: 1
        })).then((res) => {
            this.setState({
                rate: res.data.rate.rate
            });
        });
    };
    getUserDetail = () => {
        const form = this.props.form;
        axios.post('/api/user/detail',qs.stringify({
            user_id: JSON.parse(sessionStorage.getItem("altfx_user")).user_id
        })).then((res) => {
            this.setState({
                detail: res.data
            });
            form.setFieldsValue({
                "username": res.data.english_name,
            });
        });
    };
    showRMB = (value) => {
        const form = this.props.form;
        const rate = this.state.rate;
        if(value){
            form.setFieldsValue({
                "amount":value * rate
            });
        }
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            this.setState({loading: true});
            axios.post('/api/cash/charge',qs.stringify(values
            )).then((res) => {
                this.setState({loading: false});
                const cash_order = res.data.cash_order;
                if(res.data.charge_type === 'cespay'){
                    const ts = moment().format("YYYY-MM-DD HH:mm:ss");
                    document.getElementById("order_time").value = ts;
                    document.getElementById("order_no").value = "altfx_" + cash_order;
                    document.getElementById("product_name").value = this.state.detail.username + "_"+this.state.detail.unique_code;
                    this.handleCesPay(cash_order,values.amonut,ts);
                }else{
                    document.getElementById("customerTel").value = "+86" + this.state.detail.phone;
                    document.getElementById("amount").value = values.amount;
                    document.getElementById("remark").value = this.state.detail.unique_code + "+"+values.mt4_login;
                    document.getElementById("customerName").value = this.state.detail.username;
                    document.getElementById("merchantRef").value = "altfx_" + cash_order;
                    this.handlePayasia(cash_order,values.amonut,values.mt4_login);
                }
            });
          }
        });
    };
    handleCesPay = (cash_order,amount,ts) => {
        let env = (process && process.env && process.env.NODE_ENV) || 'production';
        console.log(env);
        const prefix = config[`${env}_upload_url`];
        console.log(prefix);
        axios.post('/api/cash/ces-pay-sign',qs.stringify({
            merchant_code : "100002004016",
            service_type : "direct_pay",
            pay_type : "b2c",
            interface_version : "V3.0",
            input_charset : "UTF-8",
            notify_url: prefix + "/api/notice/ces-pay-charge",
            sign_type: "RSA-S",
            order_no: "altfx_" + cash_order,
            order_time: ts,
            order_amount: amount,
            product_name: this.state.detail.username +"_" + this.state.detail.unique_code,
            return_url: "",
            bank_code: "",
            redo_flag: 1
        })).then((res) => {
            document.getElementById("sign").value = res.data.sign;
            document.cespay.submit();
            this.props.history.push("/cash/history");
        });
    };
    handlePayasia  = (cash_order,amount,mt4_login) =>{
        let env = (process && process.env && process.env.NODE_ENV) || 'production';
        console.log(env);
        const prefix = config[`${env}_upload_url`];
        console.log(prefix);
        const payinfo = {};
        payinfo.amount = amount;
        payinfo.charset = "utf8";
        payinfo.currency = "RMB";
        payinfo.fail_url = prefix + "/#/cash/history";
        payinfo.gateway = "cup";
        // payinfo.sc = "sc";
        payinfo.merchant_id = "10000546";
        payinfo.merchant_ref = "altfx_" + cash_order;
        payinfo.customer_name = this.state.detail.username;
        payinfo.customer_tel = "+86" + this.state.detail.phone;
        payinfo.remark = this.state.detail.unique_code + "+" + mt4_login;
        payinfo.success_url = prefix + "/#/cash/history";
        payinfo.security_key = "altfx20171001";
        const keys = Object.keys(payinfo).sort();
        console.log(keys);
        let sign = [];
        keys.forEach((key)=>{
            sign.push(key+"="+payinfo[key]);
        });
        console.log(sign);
        document.getElementById("signMsg").value = sha512.sha512(sign.join("&"));
        document.payasia.submit();
    };
    componentDidMount = () => {
        this.handleGetMT4List();
        this.getOrder();
        this.getRate();
        this.getUserDetail();
    };
    
    render(){
        const { getFieldDecorator } = this.props.form;
        const state = this.state;
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 7 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 10 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
              xs: {
                span: 24,
                offset: 0,
              },
              sm: {
                span: 24,
                offset: 7,
              },
            },
        };
        return(
            <Spin tip="Loading..." spinning={this.state.loading}>                                    
            <div style={{marginTop:30}}>
                <Form
                    className="ant-advanced-search-form"
                    onSubmit={this.handleSubmit}
                >
                    <Row gutter={24}>
                        <Col span={24} key="mt4_login">
                            <FormItem 
                                {...formItemLayout}
                                label="交易账户"
                            >
                                {getFieldDecorator("mt4_login", {
                                    initialValue: "",
                                    rules: [
                                        {required: false, message: '请选择帐户!',
                                    }]
                                })(
                                    <Select onChange={this.getBalance.bind(this)}>
                                        <Option value="">请选择交易帐户</Option>
                                        {this.handleMt4Option()}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={24} key="mt4">
                            <FormItem 
                                {...formItemLayout}
                                label="MT4账号"
                            >
                                {getFieldDecorator("mt4",{
                                    initialValue:""
                                })(
                                    <Input disabled placeholder="请先选择MT4帐户"/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={24} key="balance">
                            <FormItem 
                                {...formItemLayout}
                                label="帐户余额"
                            >
                                {getFieldDecorator("balance",{
                                    initialValue:""
                                })(
                                    <Input addonBefore="$" disabled placeholder="请先选择MT4帐户"/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={24} key="username">
                            <FormItem 
                                {...formItemLayout}
                                label="用户名"
                            >
                                {getFieldDecorator("username",{
                                    initialValue:""
                                })(
                                    <Input disabled/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={24} key="cash_order">
                            <FormItem 
                                {...formItemLayout}
                                label="流水号"
                            >
                                {getFieldDecorator("cash_order")(
                                    <Input disabled/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <FormItem
                                {...formItemLayout}
                                label="金额"
                            >
                                {getFieldDecorator("apply_amount",{
                                    rules:[{
                                        required:true,message:"请输入入金金额，最低金额$50"
                                    },{
                                        validator: this.handleMinVaild
                                    }]
                                })(
                                    <InputNumber
                                        style={{width:230}}
                                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                        onChange={this.showRMB}
                                    />
                                )}
                                <Tag color="red" style={{marginLeft:10}}>最低入金金额需大于50美金，小于5000美金</Tag>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={24} key="cash_order">
                            <FormItem {...tailFormItemLayout}>
                                {getFieldDecorator("amount",{
                                    rules:[{
                                        required:false,message:"请输入入金金额，最低金额$50"
                                    }]
                                })(
                                    <InputNumber
                                        style={{width:230}}
                                        formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                        disabled
                                    />
                                )}
                                
                                <Tag color="red" style={{marginLeft:10}}>当前汇率：{this.state.rate}</Tag>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={24}>
                            <FormItem {...tailFormItemLayout}>
                                <Button type="primary" htmlType="submit">下一步</Button>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <div id="paymentInto" style={{display:"none"}}>
                    <form name="cespay" method="post" action="https://pay.csepay.com/gateway?input_charset=UTF-8" >
                        <input type="hidden" name="sign" id="sign" value="" />
                        <input type="hidden" name="merchant_code" value="100002004016" />
                        <input type="hidden" name="service_type" value="direct_pay" />	
                        <input type="hidden" name="pay_type" value="b2c" />	
                        <input type="hidden" name="interface_version" value="V3.0" />			
                        <input type="hidden" name="input_charset" value="UTF-8" />	
                        <input type="hidden" name="notify_url" value="http://crm.altfx.com/api/notice/ces-pay-charge"/>
                        <input type="hidden" name="sign_type" value="RSA-S" />		
                        <input type="hidden" name="order_no" id="order_no" value=""/>
                        <input type="hidden" name="order_time" id="order_time" value="" />	
                        <input type="hidden" name="order_amount" id="order_amount" value=""/>
                        <input type="hidden" name="product_name" id="product_name" value="" />	
                        <input type="hidden" name="return_url" value=""/>	
                        <input type="hidden" name="bank_code" value="" />	
                        <input type="hidden" name="redo_flag" value="1"/>
                    </form>
                    <form name="payasia" action="https://www2.pa-sys.com/v2/payment" name="payinto" method="post">
                        <input type="hidden" id="amount" name="amount" value=""/>
                        <input type="hidden" id="charset" name="charset" value="utf8"/>
                        <input type="hidden" id="currency" name="currency" value="RMB"/>
                        <input type="hidden" id="failUrl" name="fail_url" value="http://crm.altfx.com/#/moneyHistory"/>
                        <input type="hidden" id="geteway" name="gateway" value="cup"/>
                        <input type="hidden" id="sc" name="lang" value="sc"/>
                        <input type="hidden" id="merchantId" name="merchant_id" value="10000546"/>
                        <input type="hidden" id="merchantRef" name="merchant_ref" value=""/>
                        <input type="hidden" id="customerName" name="customer_name" value=""/>
                        <input type="hidden" id="customerTel" name="customer_tel" value=""/>
                        <input type="hidden" id="remark" name="remark" value=""/>
                        <input type="hidden" id="successUrl" name="success_url" value="http://crm.altfx.com/#/moneyHistory"/>
                        <input type="hidden" id="signMsg" name="sign_msg" value=""/>
                    </form>
                </div>
            </div>
            </Spin>
        )
    }
};
export default Form.create()(RechargeForm);
