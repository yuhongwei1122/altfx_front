import React, { Component } from 'react';
import { Table, Tabs, Row, Col, List, Card, Divider, Icon, Button } from 'antd';
import axios from 'axios';
import qs from 'qs';
const TabPane = Tabs.TabPane;

export default class AgentRuleTable extends Component{
    constructor(props){
        super();
        this.state = {
            tableData: [],
            parent: [],
            pagination: {
                showTotal: (total) => `共 ${total} 条记录`,
                pageSize: 12,
                defaultCurrent: 1,
                current: 1,
                showSizeChanger:true,
                pageSizeOptions:['12', '24', '36', '48', '60', '72']
            },
            data: [
                {
                    key:"1",
                    id: "1",
                    "name":"外汇返佣金额(USD)"
                },
                {
                    id: "2",
                    key:"2",
                    "name":"贵金属返佣金额(USD)"
                }
            ]
        };
    };
    fetchTable = (params) => {
        axios.post('/api/commission/configuration',qs.stringify({
            size:this.state.pagination.pageSize,
            ...params
        })).then((res) => {
            let pager = { ...this.state.pagination };
            pager.total = Number(res.data.result_count);
            this.setState({
                pagination: {
                    total : Number(res.data.result_count),
                    ...pager
                },
                tableData : res.data.down
            });
            this.handleUpData(res.data.up);
        });
    };
    handleUpData = (data) => {
        let up = [
            {
                key:"1",
                id: "1",
                "name":"外汇返佣金额(USD)"
            },
            {
                id: "2",
                key:"2",
                "name":"贵金属返佣金额(USD)"
            }
        ];
        data.filter((item)=>{
            up[0][item.commission_model] = item.commission;
            up[1][item.commission_model] = item.commission_xauusd;
        });
        this.setState({
            data: up
        });
    };
    componentDidMount(){
        this.fetchTable({page:1});
    };
    render(){
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
        const columns = [
            {
                title: '点差类型',
                key:"key",
                dataIndex: 'name'
            }, 
            {
                title: 'ECN1',
                key:"key1",
                dataIndex: 'ECN1',
                
            }, 
            {
                title: 'ECN2',
                key:"key2",
                dataIndex: 'ECN2'
            },
            {
                title: 'ECN3',
                key:"key3",
                dataIndex: 'ECN3'
            }, 
            {
                title: 'ECN4',
                key:"key4",
                dataIndex: 'ECN4'
            },
            {
                title: 'ECN5',
                key:"key5",
                dataIndex: 'ECN5'
            }, 
            {
                title: 'ECN6',
                key:"key6",
                dataIndex: 'ECN6'
            },
        ];
        const columns_stp = [
            {
                title: '点差类型',
                key:"key",
                dataIndex: 'name'
            }, 
            {
                title: 'STP',
                key:"key1",
                dataIndex: 'STP',
            }, 
            {
                title: 'STP1',
                key:"key6",
                dataIndex: 'STP1'
            },
            {
                title: 'STP2',
                key:"key2",
                dataIndex: 'STP2',
            },
            {
                title: 'STP3',
                key:"key3",
                dataIndex: 'STP3'
            }, 
            {
                title: 'STP4',
                key:"key4",
                dataIndex: 'STP4'
            },
            {
                title: 'STP5',
                key:"key5",
                dataIndex: 'STP5'
            }
        ];
        const tablecolumns = [
            {
                title: '账户ID',
                dataIndex: 'unique_code',
                key: 'unique_code'
            },
            {
                title: '账户名称',
                dataIndex: 'account',
                key: 'account'
            },
            {
                title: '点差类型',
                dataIndex: 'commission_model',
                key: 'commission_model'
            },
            {
                title: '外汇返佣金额',
                dataIndex: 'commission',
                key: 'commission'
            },
            {
                title: '贵金属返佣金额',
                dataIndex: 'commission_xauusd',
                key: 'commission_xauusd'
            }
        ];
        return(
            <div style={{marginBottom:20,marginTop:10}}>
                <Tabs tabPosition="top">
                    <TabPane tab="下级返佣规则" key="1">
                        <div style={{marginTop:10}}>
                            <Table 
                                rowKey={record => record.id}
                                columns={tablecolumns} 
                                dataSource={this.state.tableData} 
                                pagination={this.state.pagination} 
                                onChange={this.handleChange}/>
                        </div>
                    </TabPane>
                    <TabPane tab="上级返佣规则" key="3">
                        <div className="commission_edit">
                            <Row gutter={24}>
                                <Col span={8}>
                                    <Card title="上级代理ID" style={{ width: 300 }}>
                                        {this.state.unique_code}
                                    </Card>
                                </Col>
                                <Col span={8}>
                                    <Card title="当前代理ID" style={{ width: 300 }}>
                                        {this.state.parent_code}
                                    </Card>
                                </Col>
                                <Col span={8}>
                                    <Card title="是否是省级代理" style={{ width: 300 }}>
                                        {this.state.parent_code}
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                        <div>
                            <Table style={{marginTop:"20px"}} bordered dataSource={this.state.data} columns={columns} pagination={false}/>
                            <Table style={{marginTop:"20px"}} bordered dataSource={this.state.data} columns={columns_stp} pagination={false}/>    
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        )
    }
};