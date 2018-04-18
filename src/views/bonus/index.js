import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Modal, Tag, Card, Row, Col } from 'antd';
import axios from 'axios';
import qs from 'qs';
import DateFormate from '../../components/tool/DateFormatPan';
import SearchForm from './search';
const ButtonGroup = Button.Group;

class BonusTable extends Component {
    constructor(props){
        super(props);
        this.state = {
            tableData: [],
            pagination: {
                showTotal: (total) => `共 ${total} 条记录`,
                pageSize: 10,
                defaultCurrent: 1,
                current: 1,
                showSizeChanger:true,
                pageSizeOptions:['10', '20', '30', '40', '50', '100']
            },
            total_bonus: "",
            total_count: "",
            total_users: ""
        }
    };
    fetchTotal = (params = {}) => {
        // console.log("fetchData中page=："+this.state.pagination.current);
        console.log(params);
        axios.post('/api/bonus/summary',qs.stringify({
            login_unique_code: JSON.parse(sessionStorage.getItem("altfx_user")).unique_code,
            agent_unique_code: JSON.parse(sessionStorage.getItem("altfx_user")).invite_code,
            ...params
        })).then((res) => {
            this.setState({
                total_bonus: res.data.total_bonus
            });
        });
    };
    fetchTable = (params = {}) => {
        // console.log("fetchData中page=："+this.state.pagination.current);
        console.log(params);
        axios.post('/api/bonus/detail',qs.stringify({
            login_unique_code: JSON.parse(sessionStorage.getItem("altfx_user")).unique_code,
            agent_unique_code: JSON.parse(sessionStorage.getItem("altfx_user")).invite_code,
            size: this.state.pagination.pageSize,  //每页数据条数
            ...params
        })).then((res) => {
            let pager = { ...this.state.pagination };
            this.setState({
                pagination: {
                    total : Number(res.data.result_count),
                    ...pager
                },
                tableData : res.data.result
            });
        });
    };
    fetchData = (params) => {
        console.log("一起执行了吗");
        axios.all([this.fetchTotal(params), this.fetchTable(params)])
        .then(axios.spread(function (acct, perms) {
            // Both requests are now complete
            console.log(perms);
            console.log(acct);
        }));
    };
    handleSearch = (params)=>{
        this.fetchData({
            page:1,
            ...params
        });
    };
    componentDidMount(){
        // console.log("did mount 中当前的页："+this.state.pagination.current);
        this.fetchData({page:1});
    };
    render() {
        const columns = [
            {
                title: '流水号',
                dataIndex: 'bonus_order',
                key: 'bonus_order',
                width:180
            },
            {
                title: '发放时间',
                dataIndex: 'bonus_time',
                key: 'bonus_time',
                width:140,
                render:(text) => {
                    return <DateFormate date={text} format="yyyy-MM-dd hh:mm:ss"/>;
                }
            },
            {
                title: '发放金额',
                dataIndex: 'bonus',
                key: 'bonus',
                width:140
            },
            {
                title: '发放人',
                dataIndex: 'operator',
                key: 'operator',
                width:140
            },
            {
                title: '备注',
                dataIndex: 'remark',
                key: 'remark',
                width:140
            }
        ];
        return (
            <div className="report">
                <div style={{marginTop:10}}>
                    <SearchForm handleSearch={this.handleSearch}/>
                </div>
                <div>
                    <Row gutter={24}>
                        <Col span={8}>
                            <Card title="累计奖金收入" style={{ width: 300 }}>
                                {this.state.total_bonus}
                            </Card>
                        </Col>
                    </Row>
                </div>
                <div style={{marginTop:10}}>
                    <Table 
                        rowKey={record => record.id}
                        columns={columns} 
                        dataSource={this.state.tableData} 
                        pagination={this.state.pagination} 
                        onChange={this.handleChange}
                        scroll={{ x: 1170,y: 240 }} />
                </div>
            </div>
        );
    }
};
export default BonusTable;