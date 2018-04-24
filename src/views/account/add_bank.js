import React, { Component } from 'react';
import { Button, Input, Form, Spin, message } from 'antd';
import axios from 'axios';
import qs from 'qs';
const FormItem = Form.Item;

class AddBankForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            this.setState({loading: true});
            values.id = this.props.editData.id;
            axios.post('/platform/user/perms/update',qs.stringify(values
            )).then((res) => {
                this.setState({loading: false});
                if(Number(res.error.returnCode) === 0){
                    this.props.handleEditOk();
                }else{
                    message.error(res.error.retrunUserMessage);
                }
            });
          }
        });
    };
    componentWillMount(){
        this.setState({
            loading: true
        });
    };
    componentDidMount(){
        this.setState({
            loading: false
        });
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
                        label="姓名"
                        >
                        {getFieldDecorator('username')(
                            <Input disabled/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="姓名拼音"
                        >
                        {getFieldDecorator('english_name')(
                            <Input disabled/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="银行名称"
                        >
                        {getFieldDecorator('bank_name', {
                            rules: [{
                                required: true, message: '请输入银行名称!',
                            }],
                        })(
                            <Input placeholder="请输入银行名称"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="开户行"
                        >
                        {getFieldDecorator('opening_bank', {
                            rules: [{
                                required: true, message: '请输入开户行!',
                            }],
                        })(
                            <Input placeholder="请输入开户行"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="卡号"
                        >
                        {getFieldDecorator('card_no', {
                            rules: [{
                                required: true, message: '请输入卡号!',
                            }],
                        })(
                            <Input placeholder="请输入卡号"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="开户行所在省"
                        >
                        {getFieldDecorator('province', {
                            rules: [{
                                required: true, message: '请输入开户行所在省!',
                            }],
                        })(
                            <Input placeholder="请输入开户行所在省"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="开户行所在省"
                        >
                        {getFieldDecorator('city', {
                            rules: [{
                                required: true, message: '请输入开户行所在市!',
                            }],
                        })(
                            <Input placeholder="请输入开户行所在市"/>
                        )}
                    </FormItem>
                    <FormItem {...tailFormItemLayout}>
                        <Button onClick={this.props.handleEditCancel}>取消</Button>
                        <Button type="primary" style={{marginLeft:40}} htmlType="submit">确认</Button>
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
                ...props.editData,
                value: props.editData['username'],
            }),
            english_name: Form.createFormField({
                ...props.editData,
                value: props.editData['english_name'],
            }),
        };
    }
})(AddBankForm);