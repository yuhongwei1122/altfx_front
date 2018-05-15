import React, { Component } from 'react';
import { Table, Spin, message } from 'antd';
import axios from 'axios';
import qs from 'qs';
import DateFormate from '../../components/tool/DateFormatPan';
import SearchForm from './flow_search';

class FlowTable extends Component {
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
    fetchData = (params = {}) => {
        // console.log("fetchData中page=："+this.state.pagination.current);
        console.log(params);
        axios.post('/api/cash/record',qs.stringify({
            user_id: JSON.parse(sessionStorage.getItem("altfx_user")).user_id,
			size: this.state.pagination.pageSize,  //每页数据条数
            ...params
        })).then((res) => {
            if(Number(res.error.returnCode) === 0){
                let pager = { ...this.state.pagination };
                pager.total = Number(res.data.result_count);
                this.setState({
                    pagination: {
                        total : Number(res.data.result_count),
                        ...pager
                    },
                    tableData : res.data.result
                });
            }else{
                message.error(res.error.returnUserMessage);
            }
            
        });
    };
    handleChange = (pagination, filters, sorter) => {
        // console.log(filters);
        // const type = {type: filters['type'].join("") || ''};
        
        this.setState({
            pagination : Object.assign(this.state.pagination, pagination)
        });
        this.fetchData({
            page:this.state.pagination.current - 1
        });
    };
    handleSearch = (params) => {
        this.fetchData({
            page: 1,
            ...params
        });
    };
    componentWillMount(){
        this.toggleLoading();
        this.fetchData({page:0});
    };
    componentDidMount(){
        this.toggleLoading();
    };
    render() {
        const columns = [
            {
                title: '流水号',
                dataIndex: 'cash_order',
                key: 'cash_order'
            },
            {
                title: '类型',
                dataIndex: 'cash_type',
                key: 'cash_type',
                render: (text) => {
                    if(Number(text) === 1){
                        return "入金";
                    }else{
                        return "出金";
                    }
                }
            },
            {
                title: 'MT4账户',
                dataIndex: 'mt4_login',
                key: 'mt4_login',
            }, 
            {
                title: '时间',
                dataIndex: 'create_time',
                key: 'create_time',
                render:(text) => {
                    return <DateFormate date={text} format="yyyy-MM-dd hh:mm:ss"/>;
                }
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: (text,row) => {
                    if(Number(text) === 1){
                        if(Number(row.cash_type) === 2){
                            return "待审核";
                        }else{
                            return "待支付";
                        }
                    }else if(Number(text) === 2){
                        return "已支付，待审核";
                    }else if(Number(text) === 3){
                        return "财务已确认";
                    }else if(Number(text) === 4){
                        return "客服已确认";
                    }else if(Number(text) === 5){
                        return "已完成";
                    }else if(Number(text) === 6){
                        return "审核拒绝";
                    }else if(Number(text) === 7){
                        return "支付失败";
                    }else{
                        return "已取消";
                    }
                }
            }, 
            {
                title: '金额(USD)',
                dataIndex: 'apply_amount',
                key: 'apply_amount',
            }, 
            {
                title: '实际金额',
                dataIndex: 'real_amount',
                key: 'real_amount',
            }
        ];
        return (
            <Spin tip="亲，正在努力加载中，请稍后..." spinning={this.state.globalLoading}>                        
            <div className="overview">
                <div>
                    <SearchForm handleSearch={this.handleSearch}/>
                </div>
                <div style={{marginTop:10}}>
                    <Table 
                        rowKey={record => record.cash_order}
                        columns={columns} 
                        dataSource={this.state.tableData} 
                        pagination={this.state.pagination} 
                        onChange={this.handleChange} />
                </div>
            </div>
            </Spin>
        );
    }
};
export default FlowTable;