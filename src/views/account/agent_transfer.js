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
            cusList: [],
            mt4List: []
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
    handleGetCusList = () => {
        axios.post('/api/user/getmt4').then((res) => {
            this.setState({
                cusList : res.data
            });
        });
    };
    handleGetCusMt4List = (value) => {
        const form = this.props.form;
        form.setFieldsValue({
            "out_mt4": "",
        });
        if(value){
            axios.post('/api/user/getmt4',qs.stringify({
                account: value
            })).then((res) => {
                this.setState({
                    mt4List : res.data
                });
            });
        }else{
            this.setState({
                mt4List : []
            });
        }
    };
    handleCusOption = () =>{
        const cusList = this.state.cusList;
        return cusList.map((item)=>{
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
                    if(Number(item.mt4_login) !== Number(value)){
                        return true;
                    }else{
                        return false;
                    }
                })
            });
            axios.post('/api/user/agent-account',qs.stringify({
                mt4_login: value,
                id: JSON.parse(sessionStorage.getItem("altfx_user")).user_id //当前登录用户的id
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
        this.handleGetCusList();
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
        const options = this.state.mt4List.map(d => <Option key={d.mt4_login}>{d.mt4_name}</Option>);
        // console.log(options);
        return (
            <Spin spinning={this.state.loading}>
                <Form onSubmit={this.handleSubmit}>
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
                        label="CRM帐户"
                        >
                        {getFieldDecorator('out_amount',{
                            initialValue: "",
                            rules:[{
                                required: true, message:"请选择要转入的CRM帐户!"
                            }]
                        })(
                            <Select onChange={this.handleGetCusMt4List}>
                                <Option value="">请选择要转入的CRM帐户</Option>
                                {this.handleCusOption()}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="转入帐户"
                        >
                        {getFieldDecorator('out_mt4',{
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
export default  Form.create({
    mapPropsToFields(props) {
        return {
            balance: Form.createFormField({
                ...props.balance,
                value: props.balance,
            }),
        };
    }
})(editForm);