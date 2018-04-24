import React, { Component } from 'react';
import { Button, Input, Form, Spin, Alert } from 'antd';
import axios from 'axios';
import qs from 'qs';
const FormItem = Form.Item;

class ForgetForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            email: ""
        }
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            this.setState({loading: true});
            axios.post('/api/login/find-pwd',qs.stringify(values
            )).then((res) => {
                this.props.form.resetFields();
                this.setState({loading: false});
                const text = "找回密码邮件已发送至您的邮箱（"+this.state.email+"），请登陆您的邮箱查看邮件进行设置新密码操作";
                if(Number(res.error.returnCode) === 0){
                    this.props.handleForgetOk(text);
                }else{
                    return (
                        <Alert
                            message="Error"
                            description={res.error.returnUserMessage}
                            type="error"
                            showIcon
                        />
                    );
                }
            });
          }
        });
    };
    handleVaild = (rule, value, callback) => {
        if(value){
            axios.post('/api/register/account-check',qs.stringify({
                account: value
            })).then((res) => {
                if(Number(res.error.returnCode) === 0){
                    callback('用户名不存在!');
                }else{
                    this.setState({
                        email: res.data.mail
                    });
                    callback();
                }
            });
        }else{
            callback();
        }
    };
    handleReset = (e) => {
        this.props.form.resetFields();
        e.preventDefault();
        this.props.handleForgetClose();
    };
    render() {
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 6 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
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
                    <FormItem
                        {...formItemLayout}
                        label="用户名"
                        >
                        {getFieldDecorator('username', {
                            rules: [{
                                required: true, message: '请输入用户名!'
                            },{
                                validator: this.handleVaild
                            }]
                        })(
                            <Input placeholder="请输入用户名"/>
                        )}
                    </FormItem>
                    <FormItem {...tailFormItemLayout}>
                        <Button onClick={this.handleReset}>取消</Button>
                        <Button type="primary" style={{marginLeft:40}} htmlType="submit">确认</Button>
                    </FormItem>
                </Form>
            </Spin>
        );
    }
};
export default  Form.create()(ForgetForm);