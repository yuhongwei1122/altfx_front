import React, { Component } from 'react';
import { Button, Input, Form, Spin, Tooltip, Divider, Icon, Select, Radio, Modal, Tag} from 'antd';
import axios from 'axios';
import qs from 'qs';
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class Step1Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmDirty: false,
            loading: false,
            urlFlag: this.props.editData.urlFlag
        }
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            console.log(values);
            if (!err) {
            console.log(values);
            this.props.handleNext(values);
          }
        });
    };
    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };
    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
          callback('两次输入密码不一致!');
        } else {
          callback();
        }
    };
    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
    };
    //用户名校验是否被占用
    handleCheckAccount = (e) => {
        const { form } = this.props;
        const account = e.target.value;
        if(e.target.value){
            axios.post('/api/register/account-check',qs.stringify({
                account: e.target.value
            }))
            .then((res) => {
                if(Number(res.error.returnCode) != 0){
                    Modal.info({
                        title: '提示',
                        content: (
                          <div>用户名:{account}已经注册过该系统，请更换！</div>
                        ),
                        onOk() {
                            form.setFieldsValue({
                                "account": account,
                            });
                        },
                        okText:"关闭"
                    });
                }
            })
        }else{
            return false;
        }
    };
    handleExtraFee = (e) => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        if(Number(e.target.value) === 1){
            const nextKeys = keys.concat("extra_amount");
            // can use data-binding to set
            // important! notify form to detect changes
            form.setFieldsValue({
                keys: nextKeys,
            });
        }else{
            // can use data-binding to set
            form.setFieldsValue({
                keys: keys.filter(key => key !== 'extra_amount'),
            });
        } 
    };
    handleExtraFeeOption = () => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        if(keys.length > 0){
            return false;
        }else{
            const nextKeys = keys.concat("extra_amount");
            // can use data-binding to set
            // important! notify form to detect changes
            form.setFieldsValue({
                keys: nextKeys,
            });
        }
    };
    componentDidMount(){
        console.log(this.props.editData);
        if(Number(this.props.editData.extra_fee) === 1){
            this.handleExtraFeeOption();
        }
    };
    
    render() {
        const { getFieldDecorator, getFieldValue} = this.props.form;

        const formItemLayout = {
          labelCol: {
            xs: { span: 8 },
            sm: { span: 8 },
          },
          wrapperCol: {
            xs: { span: 8 },
            sm: { span: 8 },
          },
        };
        const tailFormItemLayout = {
            wrapperCol: {
              xs: {
                span: 24,
                offset: 0,
              },
              sm: {
                span: 16,
                offset: 8,
              },
            },
        };
        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');
        const formItems = keys.map((k) => {
            if(k === 'extra_amount'){
                return (
                    <FormItem
                      {...formItemLayout}
                      label="手续费"
                      key="extra_amount"
                    >
                        {getFieldDecorator('extra_amount',{
                            initialValue: "10",
                            rules: [{
                                required: true, message: '请选择手续费!',
                            }],
                        })(
                            <Select disabled={this.props.editData.extraamountFlag}>   
                                <Option value="10">$10</Option>
                                <Option value="20">$20</Option>
                                <Option value="30">$30</Option>
                                <Option value="40">$40</Option>
                                <Option value="50">$50</Option>
                            </Select>
                      )}
                    </FormItem>
                )
            }
        });
        return (
            <Spin spinning={this.state.loading}>
                <Form onSubmit={this.handleSubmit}>
                    <Divider className="reg_title" orientation="left"><Icon type="user"></Icon>登录信息</Divider>
                    <Tag style={{marginLeft:"33.3%"}} color="blue">从介绍人处获得的邀请码，通常为7个数字，自主注册无需填写</Tag>
                    <FormItem
                        {...formItemLayout}
                        label="介绍经纪人ID"
                        >
                        {getFieldDecorator('invite_code',{
                            initialValue: "",
                            rules:[{
                                pattern:/^(8|6)([0-9]{6})$/,message:"邀请码无效"
                            }]
                        })(
                            <Input disabled={this.props.editData.invitecodeFlag} placeholder="请输入介绍经纪人ID"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="用户名"
                        >
                        {getFieldDecorator('account', {
                            rules: [{
                                required: true, message: '请输入用户名!'
                            },{
                                pattern: /^(?![0-9]+$)([a-zA-Z0-9_]{8,16})$/,message:"8-16位字符，可以由字母和数字或下划线组成，不能全部是数字"
                            }]
                        })(
                            <Input placeholder="请输入用户名" onBlur={this.handleCheckAccount}/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="MT4昵称"
                        >
                        {getFieldDecorator('platform_name', {
                            rules: [{
                                required: true, message: '请输入MT4昵称!'
                            },{
                                pattern: /^([a-zA-Z0-9_]{3,16})$/,message:"3-16位字符，可以由字母和数字或下划线组成"
                            }],
                        })(
                            <Input placeholder="请输入MT4昵称"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="密码"
                        >
                        {getFieldDecorator('password', {
                            rules: [{
                                required: true, message: '请输入密码!'
                            },{
                                validator: this.validateToNextPassword,
                            },{
                                pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)([a-zA-Z0-9]{8,16})$/,message:"8-16位字符，必须由字母和数字组成"
                            }],
                        })(
                            <Input type="password" placeholder="请输入密码"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="确认密码"
                        >
                        {getFieldDecorator('re_password', {
                            rules: [{
                                required: true, message: '请输入密码!'
                            },{
                                validator: this.compareToFirstPassword,
                            },{
                                pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)([a-zA-Z0-9]{8,16})$/,message:"8-16位字符，必须由字母和数字组成"
                            }],
                        })(
                            <Input type="password" placeholder="请输入密码" onBlur={this.handleConfirmBlur}/>
                        )}
                    </FormItem>
                    <Divider className="reg_title" orientation="left"><Icon type="user"></Icon>交易信息</Divider>
                    <FormItem
                        {...formItemLayout}
                        label="交易平台类型"
                        >
                        {getFieldDecorator('platform_type',{
                            initialValue: "MT4",
                        })(
                            <Select>
                                <Option value="MT4">MT4</Option>
                                <Option value="MT5" disabled>MT5</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="账户货币"
                        >
                        {getFieldDecorator('currency',{
                            initialValue: "USD",
                        })(
                            <Select>
                                <Option value="USD">USD</Option>
                                <Option value="EUR" disabled>EUR</Option>
                                <Option value="GBP" disabled>GBP</Option>
                                <Option value="AUD" disabled>AUD</Option>
                                <Option value="SGD" disabled>SGD</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="账户货币"
                        >
                        {getFieldDecorator('leverage',{
                            initialValue: "4",
                        })(
                            <Select>
                                <Option value="1">1:50</Option>
                                <Option value="2">1:100</Option>
                                <Option value="3">1:200</Option>
                                <Option value="4">1:400</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="点差类型"
                        >
                        {getFieldDecorator('commission_model',{
                            initialValue: "STP",
                        })(
                            <Select disabled={this.props.editData.modelFlag}>
                                <Option value="STP">STP</Option>
                                <Option value="ECN">ECN</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="是否附加手续费"
                        >
                        {getFieldDecorator('extra_fee',{
                            initialValue: "0",
                        })(
                            <RadioGroup disabled={this.props.editData.extrafeeFlag} onChange={this.handleExtraFee}>
                                <Radio value="0">否</Radio>
                                <Radio value="1">是</Radio>
                            </RadioGroup>
                        )}
                    </FormItem> 
                    {formItems}
                    <FormItem {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">下一步</Button>
                    </FormItem>
                </Form>
            </Spin>
        );
    }
};
export default  Form.create({
    mapPropsToFields(props) {
        console.log(props);
        if(Object.keys(props.editData).length > 0){
            return {
                invite_code: Form.createFormField({
                    ...props.editData,
                    value: props.editData['invite_code'],
                }),
                account: Form.createFormField({
                    ...props.editData,
                    value: props.editData['account'],
                }),
                platform_name: Form.createFormField({
                    ...props.editData,
                    value: props.editData['platform_name'],
                }),
                password: Form.createFormField({
                    ...props.editData,
                    value: props.editData['password'],
                }),
                re_password: Form.createFormField({
                    ...props.editData,
                    value: props.editData['re_password'],
                }),
                platform_type: Form.createFormField({
                    ...props.editData,
                    value: props.editData['platform_type'],
                }),
                currency: Form.createFormField({
                    ...props.editData,
                    value: props.editData['currency'],
                }),
                leverage: Form.createFormField({
                    ...props.editData,
                    value: props.editData['leverage'],
                }),
                commission_model: Form.createFormField({
                    ...props.editData,
                    value: props.editData['commission_model'],
                }),
                extra_fee: Form.createFormField({
                    ...props.editData,
                    value: props.editData['extra_fee'],
                }),
                extra_amount: Form.createFormField({
                    ...props.editData,
                    value: props.editData['extra_amount'],
                }),
            };
        }
    }
})(Step1Form);