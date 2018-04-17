import React, { Component } from 'react';
import { Button, Input, Form, Spin, Tooltip, Divider, Icon, Select, Radio, Modal, Tag, Checkbox, DatePicker} from 'antd';
import axios from 'axios';
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
const RadioGroup = Radio.Group;

const customerService = 'http://altfx-crm.oss-cn-hongkong.aliyuncs.com/%E5%AE%A2%E6%88%B7%E6%9C%8D%E5%8A%A1%E5%8D%8F%E8%AE%AE.pdf';
const AntiMoney = 'http://altfx-crm.oss-cn-hongkong.aliyuncs.com/%E5%8F%8D%E6%B4%97%E9%92%B1%E5%8D%8F%E8%AE%AE.pdf';
const exchangeRisk = 'http://altfx-crm.oss-cn-hongkong.aliyuncs.com/%E9%A3%8E%E9%99%A9%E6%8F%90%E7%A4%BA.pdf';

class Step2Form extends Component {
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
            values.phone_prefix = "86";
            if (!err) {
                console.log(values);
                this.props.handleNext(values);
            }
        });
    };
    handlePrev = () => {
        this.props.handlePrev();
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
    //用户名校验是否被占用
    handleCheckAccount = (e) => {
        const { form } = this.props;
        const account = e.target.value;
        if(e.target.value){
            axios.post('/api/register/account-check',{
                account: e.target.value
            })
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
    handleCheckEmail = (e) => {
        const { form } = this.props;
        const email = e.target.value;
        if(e.target.value){
            axios.post('/api/register/mail-check',{
                mail: e.target.value
            })
            .then((res) => {
                if(Number(res.error.returnCode) != 0){
                    Modal.info({
                        title: '提示',
                        content: (
                          <div>电子邮箱:{email}已经注册过该系统，请更换！</div>
                        ),
                        onOk() {
                            form.setFieldsValue({
                                "mail": email,
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
    onChange = (date, dateString) => {
        console.log(dateString);
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
                    <Divider className="reg_title" orientation="left"><Icon type="user"></Icon>个人信息</Divider>
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
                        label="姓名拼音"
                        >
                        {getFieldDecorator('english_name', {
                            initialValue: "",
                            rules: [{
                                required: true, message: '请输入姓名拼音!'
                            },{
                                pattern: /^[a-zA-Z]+$/,message:"必须全部是字母"
                            }]
                        })(
                            <Input placeholder="请输入姓名拼音"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="微信号"
                        >
                        {getFieldDecorator('wechat', {
                            initialValue: "",
                            rules: [{
                                required: false, message: '请输入微信号!'
                            }],
                        })(
                            <Input placeholder="请输入微信号"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="性别"
                        >
                        {getFieldDecorator('sex',{
                            initialValue: "1",
                        })(
                            <RadioGroup>
                                <Radio value="1">男</Radio>
                                <Radio value="2">女</Radio>
                            </RadioGroup>
                        )}
                    </FormItem> 
                    <FormItem
                        {...formItemLayout}
                        label="出生日期"
                        >
                        {getFieldDecorator('birthday', {
                            rules: [{
                                required: true, message: '请选择出生日期!'
                            }],
                        })(
                            <DatePicker onChange={this.onChange} placeholder="请选择日期"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="国家"
                        >
                        {getFieldDecorator('country', {
                            initialValue:"中国",
                            rules: [{
                                required: true, message: '请输入国家!'
                            }],
                        })(
                            <Input placeholder="国家" disabled/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="省份"
                        >
                        {getFieldDecorator('province', {
                            rules: [{
                                required: true, message: '请输入省份!'
                            }],
                        })(
                            <Input placeholder="请输入省份"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="城市/城镇"
                        >
                        {getFieldDecorator('city', {
                            rules: [{
                                required: true, message: '请输入城市/城镇!'
                            }],
                        })(
                            <Input placeholder="请输入城市/城镇"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="街道地址"
                        >
                        {getFieldDecorator('address', {
                            rules: [{
                                required: true, message: '请输入街道具体地址!'
                            }],
                        })(
                            <Input placeholder="请输入街道具地址"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="邮政邮编"
                        >
                        {getFieldDecorator('postcode', {
                            rules: [{
                                required: true, message: '请输入邮政编码!'
                            },{
                                pattern:/^[0-9]{5,10}$/,message:"请输入正确的邮政编码"
                            }],
                        })(
                            <Input placeholder="请输入邮政编码"/>
                        )}
                    </FormItem>
                    <Divider className="reg_title" orientation="left"><Icon type="user"></Icon>联系信息</Divider>
                    <FormItem
                        {...formItemLayout}
                        label="电话号码"
                        >
                        {getFieldDecorator('phone',{
                            initialValue: "",
                            rules:[{
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
                            <Input placeholder="请输入电子邮箱" onBlur={this.handleCheckEmail}/>
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
                        {getFieldDecorator('agreement3', {
                            valuePropName: 'checked',
                            rules:[{
                                required: true,message:"请阅读并同意《外汇风险提示书》"
                            }]
                        })(
                            <Checkbox>请阅读并同意<a href={exchangeRisk} target="_blank">《外汇风险提示书》</a></Checkbox>
                        )}
                    </FormItem>
                    <FormItem {...tailFormItemLayout}>
                        <Button type="info" onClick={this.handlePrev}>上一步</Button>
                        <Button type="primary" style={{marginLeft:40}} htmlType="submit">下一步</Button>
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
                username: Form.createFormField({
                    ...props.editData,
                    value: props.editData['username'],
                }),
                english_name: Form.createFormField({
                    ...props.editData,
                    value: props.editData['english_name'],
                }),
                wechat: Form.createFormField({
                    ...props.editData,
                    value: props.editData['wechat'],
                }),
                sex: Form.createFormField({
                    ...props.editData,
                    value: props.editData['sex'],
                }),
                birthday: Form.createFormField({
                    ...props.editData,
                    value: props.editData['birthday'],
                }),
                province: Form.createFormField({
                    ...props.editData,
                    value: props.editData['province'],
                }),
                city: Form.createFormField({
                    ...props.editData,
                    value: props.editData['city'],
                }),
                address: Form.createFormField({
                    ...props.editData,
                    value: props.editData['address'],
                }),
                postcode: Form.createFormField({
                    ...props.editData,
                    value: props.editData['postcode'],
                }),
                phone: Form.createFormField({
                    ...props.editData,
                    value: props.editData['phone'],
                }),
                mail: Form.createFormField({
                    ...props.editData,
                    value: props.editData['mail'],
                }),
                re_mail: Form.createFormField({
                    ...props.editData,
                    value: props.editData['re_mail'],
                }),
                agreement1: Form.createFormField({
                    ...props.editData,
                    value: props.editData['agreement1'],
                }),
                agreement2: Form.createFormField({
                    ...props.editData,
                    value: props.editData['agreement2'],
                }),
                agreement3: Form.createFormField({
                    ...props.editData,
                    value: props.editData['agreement3'],
                }),
            };
        }
    }
})(Step2Form);