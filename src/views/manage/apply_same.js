import React, { Component } from 'react';
import { Button, Input, Form, Spin, Tooltip, Divider, Icon, Select, Radio, Modal, Notification, message, Checkbox} from 'antd';
import axios from 'axios';
import qs from 'qs';
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class ApplySameForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            unique_code: "",
            username: ""
        }
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            console.log(values);
            if (!err) {
                console.log(values);
                axios.post('/api/user/mt4-apply',qs.stringify({
                    unique_code: this.state.unique_code,
                    ...values
                })).then((res) => {
                    if(Number(res.error.returnCode) === 0){
                        this.props.form.resetFields();
                        Notification.success({
                            message: '申请成功',
                            description: '我们已经收到您的申请，工作人员会在1-2工作日内审核并邮件通知审核结果～',
                        });
                        this.props.history.push("/manage/same");
                    }else{
                        message.error(res.error.returnUserMessage);
                    }
                });
            }
        });
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
    componentDidMount(){
        this.setState({
            unique_code: this.props.match.params.unique_code || "",
            username: this.props.match.params.username || ""
        });
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
                            <Select>   
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
                    <Divider className="reg_title" orientation="left"><Icon type="user"></Icon>账户信息</Divider>
                    <FormItem
                        {...formItemLayout}
                        label="用户名"
                        >
                        {getFieldDecorator('username', {
                            rules: [{
                                required: true, message: '请输入用户名!'
                            },{
                                pattern: /^(?![0-9]+$)([a-zA-Z0-9_]{8,16})$/,message:"8-16位字符，可以由字母和数字或下划线组成，不能全部是数字"
                            }]
                        })(
                            <Input placeholder="请输入用户名" disabled/>
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
                        label="杠杆"
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
                            <Select>
                                <Option value="STP">STP</Option>
                                <Option value="ECN">ECN</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="备注"
                        >
                        {getFieldDecorator('comment',{
                            initialValue: "",
                        })(
                            <Input placeholder="可以设置备注信息"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="是否附加手续费"
                        >
                        {getFieldDecorator('extra_fee',{
                            initialValue: "0",
                        })(
                            <RadioGroup onChange={this.handleExtraFee}>
                                <Radio value="0">否</Radio>
                                <Radio value="1">是</Radio>
                            </RadioGroup>
                        )}
                    </FormItem> 
                    {formItems}
                    <FormItem style={{marginBottom:0}} {...tailFormItemLayout}>
                        {getFieldDecorator('agreement1', {
                            valuePropName: 'checked',
                            rules:[{
                                required: true,message:"请选择"
                            }]
                        })(
                            <Checkbox>我已经阅读、理解并接受客户协议和商业条款，并保证严格遵守当地的法律。</Checkbox>
                        )}
                    </FormItem>
                    <FormItem style={{marginBottom:0}} {...tailFormItemLayout}>
                        {getFieldDecorator('agreement2', {
                            valuePropName: 'checked',
                            rules:[{
                                required: true,message:"请选择"
                            }]
                        })(
                            <Checkbox>我知晓参与外汇交易的一切可能风险，并确认提供的所有相关信息准确真实。</Checkbox>
                        )}
                    </FormItem>
                    <FormItem {...tailFormItemLayout}>
                        {getFieldDecorator('agreement3', {
                            valuePropName: 'checked',
                            rules:[{
                                required: true,message:"请选择"
                            }]
                        })(
                            <Checkbox>我希望接收到公告、活动和优惠的通知邮件。（请参考隐私政策）</Checkbox>
                        )}
                    </FormItem>
                    <FormItem {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">申请</Button>
                    </FormItem>
                </Form>
            </Spin>
        );
    }
};
export default  Form.create({
    mapPropsToFields(props) {
        return {
            username: Form.createFormField({
                ...props.match.params,
                value: props.match.params['username'],
            })
        };
    }
})(ApplySameForm);