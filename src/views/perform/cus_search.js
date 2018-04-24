import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Icon, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

class CusSearchForm extends Component{
    constructor(props){
        super(props);
        this.state = {
            
        };
    };
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          console.log('Received values of form: ', values);
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
    }
    
    render(){
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
        return(
            <Form
                className="ant-advanced-search-form"
                onSubmit={this.handleSearch}
            >
                <Row gutter={24}>
                    <Col span={8} key="type">
                        <FormItem 
                            {...formItemLayout}
                            label="外汇类型"
                        >
                            {getFieldDecorator("type", {
                                initialValue: "",
                                rules: [
                                    {required: false, message: '请选择类型!',
                                }]
                            })(
                                <Select>
                                    <Option value="">全部</Option>
                                    <Option value="1">外汇</Option>
                                    <Option value="2">贵金属</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8} key="unique_code">
                        <FormItem 
                            {...formItemLayout}
                            label="客户账户ID"
                        >
                            {getFieldDecorator("unique_code", {
                                initialValue: "",
                                rules: [
                                    {required: false, message: '请输入!',
                                }]
                            })(
                                <Input placeholder="请输入客户账户ID"/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={6} offset={2} key="search">
                        <Button type="primary" htmlType="submit"><Icon type="search"></Icon>查询</Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
                    </Col>
                </Row>
            </Form>
        )
    }
};
export default Form.create()(CusSearchForm);
