import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Select, Tag, InputNumber, message, Notification, Modal, Spin } from 'antd';
import qs from 'qs';
import axios from 'axios';
import FillBank from '../account/fill_bank';
const FormItem = Form.Item;
const Option = Select.Option;

class WithdrawForm extends Component{
    constructor(props){
        super(props);
        this.state = {
            globalLoading: false,
            mt4List: [],
            rate: "",
            detail:{},
            rmb:"",
            paydata: {},
            bankList: [],
            fillVisabled: false,
            editData:{},
            city: "",
            province: "",
            bank_name: "",
            opening_bank: "",
            card_no: ""
        };
    };
    toggleLoading = () => {
        this.setState({
            globalLoading: !this.state.globalLoading
        });
    };
    handleMinVaild = (rule, value, callback) => {
        if(value && (Number(value) < 50 || Number(value) > 5000)){
            callback('最低入50美金，最多5000美金！');
        }else{
            callback();
        }
    };
    getBalance = () => {
        const form = this.props.form;
        axios.post('/api/user/agent-account',qs.stringify({
            user_id: JSON.parse(sessionStorage.getItem("altfx_user")).user_id,
        })).then((res) => {
            form.setFieldsValue({
                "balance": res.data.balance
            });
        });
    };
    getOrder = () => {
        const form = this.props.form;
        axios.post('/api/cash/create-order',qs.stringify({
            cash_type : 2
        })).then((res) => {
            form.setFieldsValue({
                "cash_order": res.data.cash_order,
            });
        });
    };
    getRate = () => {
        axios.post('/api/cash/rate-query',qs.stringify({
            rate_type : 2
        })).then((res) => {
            if(Number(res.error.returnCode) === 0){
                this.setState({
                    rate: res.data.rate.rate
                });
            }else{
                message.error(res.error.returnUserMessage);
            }
        });
    };
    getUserDetail = () => {
        const form = this.props.form;
        axios.post('/api/user/detail',qs.stringify({
            user_id: JSON.parse(sessionStorage.getItem("altfx_user")).user_id
        })).then((res) => {
            if(Number(res.error.returnCode) === 0){
                this.setState({
                    detail: res.data
                });
                form.setFieldsValue({
                    "username": res.data.english_name,
                });
            }else{
                message.error(res.error.returnUserMessage);
            }
        });
    };
    getBankList = () => {
        axios.post('/api/cash/card-list')
        .then((res) => {
            if(res.data && res.data.length > 0){
                this.setState({
                    bankList: res.data
                });
            }else{
                message.warning('请先添加银行卡～');
                this.props.history.push("/account/bank");
            }
        });
    };
    handleBankOption = () =>{
        const bankList = this.state.bankList;
        return bankList.map((item)=>{
            const cardno = item.card_no.substr(-4,4);
            return <Option key={item.id} value={item.id}>{item.bank_name}****{cardno}</Option>
        });
    };
    changeBank = (value) => {
        const bankList = this.state.bankList;
        let city = "";
        let bank_name = "";
        let opening_bank = "";
        let card_no = "";
        let province = "";
        bankList.filter((item)=>{
            if(Number(item.id) === Number(value)){
                city = item.city ? item.city : "";
                opening_bank = item.opening_bank;
                card_no = item.card_no;
                bank_name = item.bank_name;
                province = item.province;
            }
        });
        if(!city){
            this.setState({
                editData:{
                    opening_bank: opening_bank,
                    card_no: card_no,
                    bank_name: bank_name,
                    card_id: value 
                },
                opening_bank: opening_bank,
                bank_name: bank_name,
                card_no: card_no,
                fillVisabled: true
            });
        }else{
            this.setState({
                city: city,
                province: province
            });
        }
    };
    handleBankUpdateCancel = () => {
        this.setState({
            fillVisabled: false
        });
    };
    handleBankUpdateOk = (city,province) => {
        this.setState({
            fillVisabled: false,
            city: city,
            province: province
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
            values.user_id = JSON.parse(sessionStorage.getItem("altfx_user")).user_id;
            values.rate = this.state.rate;
            values.opening_bank = this.state.opening_bank;
            values.bank_name = this.state.bank_name;
            values.card_no = this.state.card_no;
            values.city = this.state.city;
            values.province = this.state.province;
            axios.post('/api/cash/withdraw',qs.stringify(values
            )).then((res) => {
                this.setState({loading: false});
                if(Number(res.error.returnCode) === 0){
                    Notification.success({
                        message: '成功',
                        description: '您的出金申请我们已经收到，请关注您的账户变动，如有问题请联系客服～',
                    });
                    this.props.history.push("/cash/history");
                }else if(Number(res.error.returnCode) === 1){
                    Notification.error({
                        message: '警告',
                        description: '您已经有正在进行中的出金申请，该出金流程结束后才可再次申请出金～',
                    });
                    this.props.history.push("/cash/history");
                }else{
                    message.error(res.error.returnUserMessage);
                }
            });
          }
        });
    };
    componentWillMount(){
        this.toggleLoading();
        this.getBankList();
        this.getBalance();
        this.getOrder();
        this.getRate();
        this.getUserDetail();
    };
    componentDidMount(){
        // console.log("did mount 中当前的页："+this.state.pagination.current);
        this.toggleLoading();
    };
    render(){
        const { getFieldDecorator } = this.props.form;
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
            <Spin tip="亲，正在努力加载中，请稍后..." spinning={this.state.globalLoading}>                                                
            <div style={{marginTop:30}}>
                <Form
                    className="ant-advanced-search-form"
                    onSubmit={this.handleSubmit}
                >
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
                    <Row gutter={24}>
                        <Col span={24} key="bank">
                            <FormItem 
                                {...formItemLayout}
                                label="银行卡"
                            >
                                {getFieldDecorator("bank",{
                                    initialValue:"",
                                    rules: [
                                        {required: true, message: '请选择银行卡!',
                                    }]
                                })(
                                    <Select onChange={this.changeBank.bind(this)}>
                                        <Option value="">请选择银行卡</Option>
                                        {this.handleBankOption()}
                                    </Select>
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
                                        required:true,message:"请输入出金金额，最低金额$50，最多金额$5000"
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
                                <Tag color="red" style={{marginLeft:10}}>最低出金金额需大于50美金，小于5000美金</Tag>
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
                <Modal
                    visible={this.state.fillVisabled}
                    title="银行卡信息补全"
                    confirmLoading={this.state.confirmLoading}
                    footer={null}
                    >
                    <div>
                        <FillBank handleBankUpdateCancel={this.handleBankUpdateCancel} handleBankUpdateOk={this.handleBankUpdateOk} editData={this.state.editData}/>
                    </div>
                </Modal>
            </div>
            </Spin>
        )
    }
};
export default Form.create()(WithdrawForm);
