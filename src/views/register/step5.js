import React, { Component } from 'react';
import { Button, Input, Form, Spin, Tooltip, Divider, Select, Icon, Checkbox, Modal, Tag} from 'antd';
import axios from 'axios';
import qs from 'qs';
const FormItem = Form.Item;
const Option = Select.Option;
const customerService = 'http://altfx-crm.oss-cn-hongkong.aliyuncs.com/%E5%AE%A2%E6%88%B7%E6%9C%8D%E5%8A%A1%E5%8D%8F%E8%AE%AE.pdf';
const AntiMoney = 'http://altfx-crm.oss-cn-hongkong.aliyuncs.com/%E5%8F%8D%E6%B4%97%E9%92%B1%E5%8D%8F%E8%AE%AE.pdf';

class Step4Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmDirty: false,
            loading: false
        }
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            // console.log(values);
            if (!err) {
                console.log(values);
                this.props.handleSubmit(values);
            }
        });
    };
    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };
    compareToFirstEmail = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('mail')) {
          callback('两次输入邮箱不一致!');
        } else {
          callback();
        }
    };
    validateToNextEmail = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
          form.validateFields(['re_mail'], { force: true });
        }
        callback();
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
        return (
            <Spin spinning={this.state.loading}>
                <Form onSubmit={this.handleSubmit}>
                    <Divider className="reg_title" orientation="left"><Icon type="user"></Icon>登录信息</Divider>
                    <FormItem
                        {...formItemLayout}
                        label="中文姓名"
                        >
                        {getFieldDecorator('username', {
                            initialValue: "",
                            rules: [{
                                required: true, message: '请输入中文姓名!'
                            },{
                                pattern: /^[\u4e00-\u9fa5]+$/,message:"必须全部是汉字"
                            }]
                        })(
                            <Input placeholder="请输入中文姓名"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="电话号码"
                        >
                        {getFieldDecorator('phone',{
                            initialValue: "",
                            rules:[{
                                required: true, message: '请输入电话号码!',
                            },{
                                pattern:/^1([0-9]{10})$/,message:"请输入正确的电话号码"
                            }]
                        })(
                            <Input addonBefore="+86"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="电子邮箱"
                        >
                        {getFieldDecorator('mail', {
                            rules: [{
                                type: 'email', message: '请输入正确格式的电子邮箱!',
                            }, {
                                required: true, message: '请输入电子邮箱!',
                            },{
                                validator: this.validateToNextEmail,
                            }],
                        })(
                            <Input placeholder="请输入电子邮箱"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="确认邮箱"
                        >
                        {getFieldDecorator('re_mail', {
                            rules: [{
                                required: true, message: '请输入电子邮箱!'
                            },{
                                validator: this.compareToFirstEmail,
                            },{
                                type: 'email', message: '请输入正确格式的电子邮箱!',
                            }],
                        })(
                            <Input placeholder="请输入电子邮箱" onBlur={this.handleConfirmBlur}/>
                        )}
                    </FormItem>
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
                    <FormItem style={{marginBottom:0}} {...tailFormItemLayout}>
                        {getFieldDecorator('agreement1', {
                            valuePropName: 'checked',
                            rules:[{
                                required: true,message:"请阅读并同意《客户服务协议》"
                            }]
                        })(
                            <Checkbox>请阅读并同意<a href={customerService} target="_blank">《客户服务协议》</a></Checkbox>
                        )}
                    </FormItem>
                    <FormItem style={{marginBottom:0}} {...tailFormItemLayout}>
                        {getFieldDecorator('agreement2', {
                            valuePropName: 'checked',
                            rules:[{
                                required: true,message:"请阅读并同意《反洗钱协议》"
                            }]
                        })(
                            <Checkbox>请阅读并同意<a href={AntiMoney} target="_blank">《反洗钱协议》</a></Checkbox>
                        )}
                    </FormItem>
                    <FormItem {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">注册模拟账户</Button>
                    </FormItem>
                </Form>
            </Spin>
        );
    }
};
export default  Form.create()(Step4Form);