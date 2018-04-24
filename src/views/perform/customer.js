import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Modal, Tag, Card, Row, Col, Spin } from 'antd';
import axios from 'axios';
import qs from 'qs';
import DateFormate from '../../components/tool/DateFormatPan';
import SearchForm from './cus_search';
const ButtonGroup = Button.Group;

class CusPerformTable extends Component {
    constructor(props){
        super(props);
        this.state = {
            globalLoading: false,
            tableData: [],
            pagination: {
                showTotal: (total) => `共 ${total} 条记录`,
                pageSize: 10,
                defaultCurrent: 1,
                current: 1,
                showSizeChanger:true,
                pageSizeOptions:['10', '20', '30', '40', '50', '100']
            }
        }
    };
    toggleLoading = () => {
        this.setState({
            globalLoading: !this.state.globalLoading
        });
    };
    fetchTable = (params = {}) => {
        // console.log("fetchData中page=："+this.state.pagination.current);
        console.log(params);
        axios.post('/api/report/customer-summary',qs.stringify({
            login_unique_code: JSON.parse(sessionStorage.getItem("altfx_user")).unique_code,
            size: this.state.pagination.pageSize,  //每页数据条数
            ...params
        })).then((res) => {
            let pager = { ...this.state.pagination };
            pager.total = Number(res.data.result_count);
            this.setState({
                pagination: {
                    total : Number(res.data.result_count),
                    ...pager
                },
                tableData : res.data.result
            });
        });
    };
    handleSearch = (params)=>{
        this.fetchTable({
            page:1,
            ...params
        });
    };
    componentWillMount(){
        this.toggleLoading();
        this.fetchTable({page:0});
    };
    componentDidMount(){
        // console.log("did mount 中当前的页："+this.state.pagination.current);
        this.toggleLoading();
    };
    render() {
        const columns = [
            {
                title: 'CRM账户ID',
                dataIndex: 'customer_unique_code',
                key: 'customer_unique_code'
            },
            {
                title: '累计入金金额',
                dataIndex: 'customer_deposit',
                key: 'customer_deposit'
            },
            {
                title: '累计出金金额',
                dataIndex: 'customer_withdraw',
                key: 'customer_withdraw'
            },
            {
                title: '累计交易量',
                dataIndex: 'customer_volume',
                key: 'customer_volume'
            }, 
            {
                title: '累计盈亏金额',
                dataIndex: 'customer_profit',
                key: 'customer_profit'
            }, 
            {
                title: '累计返佣金额',
                dataIndex: 'agent_commission',
                key: 'agent_commission'
            },
            {
                title: '累计净入金',
                dataIndex: 'agent_deposit',
                key: 'agent_deposit'
            }
        ];
        return (
            <Spin tip="亲，正在努力加载中，请稍后..." spinning={this.state.globalLoading}>                                                
            <div className="report">
                <div style={{marginTop:10}}>
                    <SearchForm handleSearch={this.handleSearch}/>
                </div>
                <div style={{marginTop:10}}>
                    <Table 
                        rowKey={record => record.customer_unique_code}
                        columns={columns} 
                        dataSource={this.state.tableData} 
                        pagination={this.state.pagination} 
                        onChange={this.handleChange}/>
                </div>
            </div>
            </Spin>
        );
    }
};
export default CusPerformTable;