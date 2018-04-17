import React, { Component } from 'react';
import { Table, Button, Modal } from 'antd';
import axios from 'axios';
import DateFormate from '../../components/tool/DateFormatPan';
import SearchForm from './flow_search';
const ButtonGroup = Button.Group;

class FlowTable extends Component {
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
            }
        }
    };
    fetchData = (params = {}) => {
        // console.log("fetchData中page=："+this.state.pagination.current);
        console.log(params);
        axios.post('/api/trade/record',{
            params: {
				limit: this.state.pagination.pageSize,  //每页数据条数
                ...params
            }
        }).then((res) => {
            let pager = { ...this.state.pagination };
            this.setState({
                pagination: {
                    total : res.data.result_count,
                    ...pager
                },
                tableData : res.data.result
            });
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
    componentDidMount(){
        console.log("did mount 中当前的页："+this.state.pagination.current);
        this.fetchData({page:0});
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
        );
    }
};
export default FlowTable;