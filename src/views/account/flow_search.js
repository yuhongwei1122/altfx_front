import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker, Spin, message} from 'antd';
import { timingSafeEqual } from 'crypto';
import moment from 'moment';
import axios from 'axios';
import qs from 'qs';
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const Option = Select.Option;

class SearchForm extends Component{
    constructor(props){
        super(props);
        this.state = {
            globalLoading: false,
            mt4List: [],
            role: ""
        };
    };
    toggleLoading = () => {
        this.setState({
            globalLoading: !this.state.globalLoading,
        });
    };
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
        //   console.log('Received values of form: ', values);
          const day = values.search_date;
            if(day){
                values.time_start = day[0].unix();
                values.time_end = day[1].unix();
                values.search_date = null;
            }
          this.props.handleSearch(values);
        });
    };
    handleReset = (e) => {
        this.props.form.resetFields();
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log('Received values of form: ', values);
            this.props.handleSearch(values);
        });
    };
    handleGetMT4List = () => {
        axios.post('/api/user/getmt4').then((res) => {
            if(Number(res.error.returnCode) === 0){
                this.setState({
                    mt4List : res.data
                });
            }else{
                message.error(res.error.returnUserMessage);
            }
        });
    };
    handleMt4Option = () =>{
        const mt4List = this.state.mt4List;
        return mt4List.map((item)=>{
            return <Option key={item.id} value={item.mt4_login}>{item.mt4_name}</Option>
        });
    };
    componentWillMount(){
        this.toggleLoading();
        this.handleGetMT4List();
        let userinfo = {};
        if(sessionStorage.getItem("altfx_user")){
            userinfo = JSON.parse(sessionStorage.getItem("altfx_user"));
        }
        this.setState({
            role : userinfo.role || ""
        });
    };
    componentDidMount = () => {
        this.toggleLoading();
    };
    
    render(){
        const { getFieldDecorator } = this.props.form;
        const state = this.state;
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
        return(
            <Spin tip="Loading..." spinning={this.state.globalLoading}>                        
            <Form
                className="ant-advanced-search-form"
                onSubmit={this.handleSearch}
            >
                <Row gutter={24}>
                    {this.state.role.indexOf("4") > -1 ?
                        <Col span={8} key="mt4_login">
                            <FormItem 
                                {...formItemLayout}
                                label="MT4账户"
                            >
                                {getFieldDecorator("mt4_login", {
                                    initialValue: "",
                                    rules: [
                                        {required: false, message: '请选择帐户!',
                                    }]
                                })(
                                    <Select>
                                        <Option value="">全部</Option>
                                        {this.handleMt4Option()}
                                    </Select>
                                )}
                            </FormItem>
                        </Col> : 
                    null }
                    <Col span={8} key="symbol">
                        <FormItem 
                            {...formItemLayout}
                            label="类型"
                        >
                            {getFieldDecorator("cash_type", {
                                initialValue: "",
                                rules: [
                                    {required: false, message: '请选择类型!',
                                }]
                            })(
                                <Select>
                                    <Option value="">全部</Option>
                                    <Option value="1">入金</Option>
                                    <Option value="2">出金</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8} key="status">
                        <FormItem 
                            {...formItemLayout}
                            label="状态"
                        >
                            {getFieldDecorator("status", {
                                initialValue: "",
                                rules: [
                                    {required: false, message: '请选择类型!',
                                }]
                            })(
                                <Select>
                                    <Option value="0">全部</Option>
                                    <Option value="1">待支付</Option>
                                    <Option value="2">已支付</Option>
                                    <Option value="3">财务确认</Option>
                                    <Option value="4">客服确认</Option>
                                    <Option value="5">已完成</Option>
                                    <Option value="6">审核拒绝</Option>
                                    <Option value="7">支付失败</Option>
                                    <Option value="8">已取消</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={8} key="search_date">
                        <FormItem 
                            {...formItemLayout}
                            label="平仓时间"
                        >
                            {getFieldDecorator("search_date", {
                                initialValue: "",
                                rules: [
                                    {required: false, message: '请输入姓名!',
                                }]
                            })(
                                <RangePicker
                                    ranges={{ 今天: [moment(new Date(new Date().setHours(0,0,0,0))), moment()], '昨天':[moment().subtract('days', 1).hours(0).minutes(0).seconds(0),moment().subtract('days', 1).hours(23).minutes(59).seconds(59)], '本月': [moment().startOf('month'), moment()],'本周': [moment().startOf("week"), moment()],"上月":[moment().subtract("months",1).startOf('month').hours(0).seconds(0).milliseconds(0),moment().subtract("months",1).endOf('month').hours(23).seconds(59).milliseconds(59)]  }}
                                    showTime
                                    format="YYYY/MM/DD HH:mm:ss"
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8} offset={3} style={{marginTop:5}} key="search">
                        <Button type="primary" htmlType="submit"><Icon type="search"></Icon>查询</Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
                    </Col>
                </Row>
            </Form>
            </Spin>
        )
    }
};
export default Form.create()(SearchForm);
