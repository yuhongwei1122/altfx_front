import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Modal, Tag, notification, Select } from 'antd';
import axios from 'axios';
import qs from 'qs';
import DateFormate from '../../components/tool/DateFormatPan';
import SearchForm from './search';
import ChangePointForm from './change_point';
const ButtonGroup = Button.Group;
const Option = Select.Option;

class MemberAccountTable extends Component {
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
            unique_code: "",
            username: "",
            editData: {},
            editVisabled: false
        }
    };
    fetchData = (params = {}) => {
        // console.log("fetchData中page=："+this.state.pagination.current);
        console.log(params);
        axios.post('/api/member/mt4-login-list',qs.stringify({
            unique_code: this.state.unique_code,
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
    componentDidMount(){
        this.setState({
            unique_code: this.props.match.params.unique_code || "",
            username: this.props.match.params.username || "",
        });
    };
    render() {
        const columns = [
            {
                title: 'MT4账户名',
                dataIndex: 'mt4_login',
                key: 'mt4_login'
            }, 
            {
                title: 'MT4昵称',
                dataIndex: 'mt4_name',
                key: 'mt4_name'
            },
            {
                title: '点差类型',
                dataIndex: 'commission_model',
                key: 'commission_model'
            },
            {
                title: '杠杆',
                dataIndex: 'leverage',
                key: 'leverage',
                render: (text) => {
                    if(Number(text) === 1){
                        return "1:50";
                    }else if(Number(text) === 2){
                        return "1:100";
                    }else if(Number(text) === 3){
                        return "1:200";
                    }else{
                        return "1:400";
                    }
                }
            },  
            {
                title: '注册时间',
                dataIndex: 'regdate',
                key: 'regdate',
                render: (text) => {
                    return <DateFormate date={text} format="yyyy-MM-dd hh:mm:ss"/>;
                }
            }, 
            {
                title: '操作',
                dataIndex: '', 
                key: 'x', 
                render: (text, row, index) => {
                    return <Button style={{lineHeight:0}} type="danger" icon="edit">交易历史</Button>
                }
            }
        ];
        return (
            <div className="overview" style={{marginTop:"30px"}}>
                <div style={{overflow:"hidden"}}>
                   CRM账户名：{this.state.username}
                   账户ID：{this.state.unique_code}
                </div>
                <div>
                    <Table 
                        rowKey={record => record.unique_code}
                        columns={columns} 
                        dataSource={this.state.tableData} 
                        pagination={this.state.pagination} 
                        onChange={this.handleChange}/>
                </div>              
            </div>
        );
    }
};
export default MemberAccountTable;