import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Modal, Tag, notification, Select, Spin, message } from 'antd';
import axios from 'axios';
import qs from 'qs';
import DateFormate from '../../components/tool/DateFormatPan';
import SearchForm from './search';
const ButtonGroup = Button.Group;
const Option = Select.Option;

class SameAccountTable extends Component {
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
            },
            editData: {},
            editVisabled: false
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
        let info = {};
        if(sessionStorage.getItem("altfx_user")){
            info = JSON.parse(sessionStorage.getItem("altfx_user"));
        }
        axios.post('/api/member/customer-list',qs.stringify({
            login_unique_code: info.unique_code,
            unique_code: info.unique_code,
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
    handleSearch = (params) => {
        this.fetchData({page:1,...params});
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
                title: '账户ID',
                dataIndex: 'unique_code',
                key: 'unique_code'
            }, 
            {
                title: 'CRM账户名',
                dataIndex: 'account',
                key: 'account'
            },
            {
                title: '姓名',
                dataIndex: 'user_name',
                key: 'user_name'
            },
            {
                title: '余额',
                dataIndex: 'balance',
                key: 'balance'
            }, 
            {
                title: '净值',
                dataIndex: 'equity',
                key: 'equity'
            }, 
            {
                title: '注册时间',
                dataIndex: 'register_date',
                key: 'register_date',
                render: (text) => {
                    return <DateFormate date={text} format="yyyy-MM-dd hh:mm:ss"/>;
                }
            }, 
            {
                title: '操作',
                dataIndex: '', 
                key: 'x', 
                width: "330px",
                render: (text, row, index) => (
                    <ButtonGroup> 
                        <Link to={{pathname:'/manage/apply/'+row.unique_code+'/'+row.account}}><Button style={{lineHeight:0}} type="primary" icon="check">申请同名账户</Button></Link>
                        <Link to={{pathname:'/manage/trade_account/'+row.unique_code+'/'+row.account}}><Button style={{lineHeight:0}} type="danger" icon="edit">修改点差类型</Button></Link>
                    </ButtonGroup>
                )
            }
        ];
        return (
            <Spin tip="Loading..." spinning={this.state.globalLoading}>                                    
            <div className="overview" style={{marginTop:"30px"}}>
                <div style={{overflow:"hidden"}}>
                   <SearchForm handleSearch={this.handleSearch}/>
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
            </Spin>
        );
    }
};
export default SameAccountTable;