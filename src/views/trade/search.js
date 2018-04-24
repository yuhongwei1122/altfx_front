import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker, message } from 'antd';
import { timingSafeEqual } from 'crypto';
import moment from 'moment';
import axios from 'axios';
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const Option = Select.Option;

class SearchForm extends Component{
    constructor(props){
        super(props);
        this.state = {
            mt4List: []
        };
    };
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log('Received values of form: ', values);
            const day = values.search_date;
            if(day){
                values.close_time_start = day[0].unix();
                values.close_time_end = day[1].unix();
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
    componentDidMount = () => {
        this.handleGetMT4List();
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
            <Form
                className="ant-advanced-search-form"
                onSubmit={this.handleSearch}
            >
                <Row gutter={24}>
                    <Col span={8} key="mt4_login">
                        <FormItem 
                            {...formItemLayout}
                            label="帐户"
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
                    </Col>
                    <Col span={8} key="symbol">
                        <FormItem 
                            {...formItemLayout}
                            label="交易品类"
                        >
                            {getFieldDecorator("symbol", {
                                initialValue: "",
                                rules: [
                                    {required: false, message: '请选择!',
                                }]
                            })(
                                <Select>
                                    <Option value="">全部</Option>
                                    <Option value="1">货币</Option>
                                    <Option value="2">贵金属</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8} key="profit">
                        <FormItem 
                            {...formItemLayout}
                            label="盈亏类型"
                        >
                            {getFieldDecorator("profit", {
                                initialValue: "",
                                rules: [
                                    {required: false, message: '请选择类型!',
                                }]
                            })(
                                <Select>
                                    <Option value="">全部</Option>
                                    <Option value="1">盈利</Option>
                                    <Option value="2">亏损</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={10} key="search_date">
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
        )
    }
};
export default Form.create()(SearchForm);
