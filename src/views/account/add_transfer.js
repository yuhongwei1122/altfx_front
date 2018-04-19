import React, { Component } from 'react';
import { Button, Input, Form, Spin, InputNumber, Select, message } from 'antd';
import axios from 'axios';
import qs from 'qs';
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;

class editForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            mt4List: [],
            mt4out: []
        }
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            this.setState({loading: true});
            axios.post('/api/user/transfer_confirm',qs.stringify(values))
            .then((res) => {
                this.setState({loading: false});
                if(Number(res.error.returnCode) === 0){
                    this.props.handleEditOk();
                }else{
                    message.error(res.error.returnUserMessage);
                }
            });
          }
        });
    };
    //可转账金额控制
    handleApplyAmount = (rule, value, callback)=>{
        const form = this.props.form;
        if (value && value > form.getFieldValue('balance')) {
          callback('最大可转账金额不能超过帐户余额!');
        } else {
          callback();
        }
    };
    handleGetMT4List = () => {
        axios.post('/api/user/getmt4').then((res) => {
            this.setState({
                mt4List : res.data,
                mt4out: res.data
            });
        });
    };
    handleMt4Option = () =>{
        const mt4List = this.state.mt4List;
        return mt4List.map((item)=>{
            return <Option key={item.id} value={item.mt4_login}>{item.mt4_name}</Option>
        });
    };
    //转出帐户切换触发
    handleAccountChange = (value)=>{
        const form = this.props.form;
        const list = this.state.mt4List;
        if(value){
            this.setState({
                mt4out: list.filter(item => {
                    if(item.mt4_login != value){
                        return true;
                    }else{
                        return false;
                    }
                })
            });
            axios.post('/api/user/user-account',qs.stringify({
                mt4_login: value,
                id: JSON.parse(sessionStorage.getItem("altfx_user")).user_id
            })).then((res) => {
                if(Number(res.error.returnCode) === 0){
                    form.setFieldsValue({
                        "balance": res.data.balance,
                    });
                    form.validateFields(['apply_amount'], { force: true });
                }else{
                    message.error(res.error.returnUserMessage);
                }
            });
        }else{
            this.setState({
                mt4out: list
            });
        }
    };
    componentWillMount(){
        this.setState({
            loading: true
        });
        this.handleGetMT4List();
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
        console.log(this.state.mt4out);
        const options = this.state.mt4out.map(d => <Option key={d.mt4_login}>{d.mt4_name}</Option>);
        console.log(options);
        return (
            <Spin spinning={this.state.loading}>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem
                        {...formItemLayout}
                        label="转出帐户"
                        >
                        {getFieldDecorator('in_amount',{
                            initialValue: "",
                            rules:[{
                                required: true, message:"请选择转出帐户!"
                            }]
                        })(
                            <Select onChange={this.handleAccountChange}>
                                <Option value="">请选择转入帐户</Option>
                                {this.handleMt4Option()}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="帐户余额"
                        >
                        {getFieldDecorator('balance')(
                            <Input disabled/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="转账金额"
                        >
                        {getFieldDecorator('apply_amount',{
                            initialValue: "",
                            rules:[{
                                required: true, message:"请输入转账金额!"
                            },{
                                validator: this.handleApplyAmount
                            }]
                        })(
                            <InputNumber style={{width:"100%"}} placeholder="请输入转账金额，不能超过帐户余额"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="转入帐户"
                        >
                        {getFieldDecorator('out_amount',{
                            initialValue: "",
                            rules:[{
                                required: true, message:"请选择转入帐户!"
                            }]
                        })(
                            <Select>
                                <Option value="">请选择转入帐户</Option>
                                {options}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="备注"
                        >
                        {getFieldDecorator('note', {
                            rules: [{
                                required: false, message: '请输入备注!',
                            }],
                        })(
                            <TextArea placeholder="可以设置备注信息" autosize={{ minRows: 2}} />
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
export default  Form.create()(editForm);