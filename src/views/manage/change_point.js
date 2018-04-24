import React, { Component } from 'react';
import { Button, Input, Form, Spin, Select, Notification, message} from 'antd';
import axios from 'axios';
import qs from 'qs';
const FormItem = Form.Item;
const Option = Select.Option;

class ChangePointForm extends Component {
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
                axios.post('/api/member/update-commission-model',qs.stringify({
                    unique_code: this.props.editData.unique_code,
                    mt4_name: this.props.editData.mt4_name,
                    mt4_login: this.props.editData.mt4_login,
                    user_id: JSON.parse(sessionStorage.getItem("altfx_user")).user_id,
                    ...values
                })).then((res) => {
                    if(Number(res.error.returnCode) === 0){
                        this.props.form.resetFields();
                        Notification.success({
                            message: '申请成功',
                            description: '我们已经收到点差类型修改申请，请您的用户关注邮件通知，谢谢！～',
                        });
                        this.props.handleEditCancel();
                    }else{
                        message.error(res.error.returnUserMessage);
                    }
                });
            }
        });
    };
    
    render() {
        const { getFieldDecorator } = this.props.form;

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
                    <FormItem
                        {...formItemLayout}
                        label="原点差类型"
                        >
                        {getFieldDecorator('legacy_commission_model')(
                            <Input disabled/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="新点差类型"
                        >
                        {getFieldDecorator('new_commission_model',{
                            initialValue: "",
                        })(
                            <Select>
                                <Option value="">请选择新点差类型</Option>
                                <Option value="ECN1" disabled={this.props.editData.legacy_commission_model === 'ECN1' ? true : false}>ECN1</Option>
                                <Option value="ECN2" disabled={this.props.editData.legacy_commission_model === 'ECN2' ? true : false}>ECN2</Option>
                                <Option value="ECN3" disabled={this.props.editData.legacy_commission_model === 'ECN3' ? true : false}>ECN3</Option>
                                <Option value="ECN4" disabled={this.props.editData.legacy_commission_model === 'ECN4' ? true : false}>ECN4</Option>
                                <Option value="ECN5" disabled={this.props.editData.legacy_commission_model === 'ECN5' ? true : false}>ECN5</Option>
                                <Option value="ECN6" disabled={this.props.editData.legacy_commission_model === 'ECN6' ? true : false}>ECN6</Option>
                                <Option value="STP" disabled={this.props.editData.legacy_commission_model === 'STP' ? true : false}>STP</Option>
                                <Option value="STP1" disabled={this.props.editData.legacy_commission_model === 'STP1' ? true : false}>STP1</Option>
                                <Option value="STP2" disabled={this.props.editData.legacy_commission_model === 'STP2' ? true : false}>STP2</Option>
                                <Option value="STP3" disabled={this.props.editData.legacy_commission_model === 'STP3' ? true : false}>STP3</Option>
                                <Option value="STP4" disabled={this.props.editData.legacy_commission_model === 'STP4' ? true : false}>STP4</Option>
                                <Option value="STP5" disabled={this.props.editData.legacy_commission_model === 'STP5' ? true : false}>STP5</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...tailFormItemLayout}>
                        <Button style={{marginRight:20}}>取消</Button>
                        <Button type="primary" htmlType="submit">确定</Button>
                    </FormItem>
                </Form>
            </Spin>
        );
    }
};
export default  Form.create({
    mapPropsToFields(props) {
        return {
            legacy_commission_model: Form.createFormField({
                ...props.editData,
                value: props.editData['legacy_commission_model'],
            })
        };
    }
})(ChangePointForm);