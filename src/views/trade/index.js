import React, { Component } from 'react';
import { Table, Button, Modal, message, Spin } from 'antd';
import axios from 'axios';
import qs from 'qs';
import DateFormate from '../../components/tool/DateFormatPan';
import SearchForm from './search';
const ButtonGroup = Button.Group;

class TradeTable extends Component {
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
        axios.post('/api/trade/record',qs.stringify({
            size: this.state.pagination.pageSize,  //每页数据条数
            ...params
        })).then((res) => {
            if(Number(res.error.returnCode) === 0){
                let pager = { ...this.state.pagination };
                pager.total = Number(res.data.result_count);
                this.setState({
                    pagination: {
                        total : res.data.result_count,
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
        // console.log("did mount 中当前的页："+this.state.pagination.current);
        this.toggleLoading();
    };
    render() {
        const columns = [
            {
                title: '订单',
                dataIndex: 'trade_order',
                key: 'trade_order'
            },
            {
                title: '交易时间',
                dataIndex: 'tradeTime',
                key: 'tradeTime',
                render:(text) => {
                    return <DateFormate date={text} format="yyyy-MM-dd hh:mm:ss"/>;
                }
            },
            {
                title: '货币对',
                dataIndex: 'symbol',
                key: 'symbol',
            }, 
            {
                title: '成交量',
                dataIndex: 'volume',
                key: 'volume',
            }, 
            {
                title: '开仓价',
                dataIndex: 'open_price',
                key: 'open_price',
            }, 
            {
                title: '平仓价',
                dataIndex: 'close_price',
                key: 'close_price',
            }, 
            {
                title: '止损/止赢',
                dataIndex: 'sl',
                key: 'sl'
            },
            {
                title: '盈亏',
                dataIndex: 'profit', 
                key: 'profit'
            },
        ];
        return (
            <Spin tip="Loading..." spinning={this.state.globalLoading}>                                    
            <div className="overview">
                <div>
                    <SearchForm handleSearch={this.handleSearch}/>
                </div>
                <div style={{marginTop:10}}>
                    <Table 
                        rowKey={record => record.trade_order}
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
export default TradeTable;