import React, { Component } from 'react';
import { Button, Input, Form, Spin, Tooltip, Divider, Icon, Modal, Tag} from 'antd';
import axios from 'axios';
import qs from 'qs';
const FormItem = Form.Item;

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
                password: Form.createFormField({
                    ...props.editData,
                    value: props.editData['password'],
                }),
                re_password: Form.createFormField({
                    ...props.editData,
                    value: props.editData['re_password'],
                })
            };
        }
    }
})(Step4Form);