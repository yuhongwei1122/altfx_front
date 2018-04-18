import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Modal, Tag, Card, Row, Col } from 'antd';
import axios from 'axios';
import qs from 'qs';
import DateFormate from '../../components/tool/DateFormatPan';
import SearchForm from './agent_search';
const ButtonGroup = Button.Group;

class AgentPerformTable extends Component {
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
    fetchTable = (params = {}) => {
        // console.log("fetchData中page=："+this.state.pagination.current);
        console.log(params);
        axios.post('/api/report/agent-summary',qs.stringify({
            login_unique_code: JSON.parse(sessionStorage.getItem("altfx_user")).unique_code,
            from:this.props.from,
            to:this.props.to,
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
    handleSearch = (params)=>{
        this.fetchTable({
            page:1,
            ...params
        });
    };
    componentDidMount(){
        console.log("did mount 中当前的页："+this.state.pagination.current);
        this.fetchTable({page:1});
    };
    render() {
        const columns = [
            {
                title: '代理账户ID',
                dataIndex: 'agent_unique_code',
                key: 'agent_unique_code'
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
            <div className="report">
                <div style={{marginTop:10}}>
                    <SearchForm handleSearch={this.handleSearch}/>
                </div>
                <div style={{marginTop:10}}>
                    <Table 
                        rowKey={record => record.agent_unique_code}
                        columns={columns} 
                        dataSource={this.state.tableData} 
                        pagination={this.state.pagination} 
                        onChange={this.handleChange}/>
                </div>
            </div>
        );
    }
};
export default AgentPerformTable;