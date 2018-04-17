import React, { Component } from 'react';
import { Table, Button, Modal } from 'antd';
import axios from 'axios';
import DateFormate from '../../components/tool/DateFormatPan';
import EditForm from './add_transfer';
import EditAgentForm from './agent_transfer'

class TransferTable extends Component {
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
            confirmLoading: false,//加载中开关
            editVisabled: false,
            editAgentVisabled: false,
            balance: ""
        }
    };
    fetchData = (params = {}) => {
        // console.log("fetchData中page=："+this.state.pagination.current);
        console.log(params);
        axios.get('/api/account/transfer',{
            params: {
				limit: this.state.pagination.pageSize,  //每页数据条数
                ...params
            }
        }).then((res) => {
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
    
    showEditModal = () => {
        this.setState({
            editVisabled: true
        });
    };
    showAgentEditModal = () => {
        this.setState({
            editAgentVisabled: true
        });
    };
    handleEditOk = () => {
        this.fetchData();
        this.setState({ 
            editVisabled: false,
            editAgentVisabled: false
        });
    };
    handleEditCancel = () => {
        this.setState({
            detail: {},
            editVisabled: false,
            editAgentVisabled: false
        });
    };
    handleGetBalance = () => {
        axios.post('/api/user/agent-account',{
            mt4_login: "",
            id:""
        }).then((res) => {
            this.setState({
                balance : res.data.balance
            });
        });
    };
    componentDidMount(){
        console.log("did mount 中当前的页："+this.state.pagination.current);
        this.fetchData({page:0});
        this.handleGetBalance();
    };
    render() {
        const columns = [
            {
                title: '序号',
                dataIndex: 'id',
                key: 'id'
            },
            {
                title: '申请时间',
                dataIndex: 'time_create',
                key: 'time_create',
                render:(text) => {
                    return <DateFormate date={text} format="yyyy-MM-dd hh:mm:ss"/>;
                }
            },
            {
                title: '转账金额',
                dataIndex: 'amount',
                key: 'amount',
            },
            {
                title: '转入MT4帐户',
                dataIndex: 'mt4_login',
                key: 'mt4_login',
            },
            {
                title: '转入CRM帐户',
                dataIndex: 'unique_code',
                key: 'unique_code',
            },
            {
                title: '状态',
                dataIndex: 'status', 
                key: 'status'
            },
            {
                title: '描述',
                dataIndex: 'note',
                key: 'note',
            }
        ];
        return (
            <div className="overview">
                <div style={{marginBottom:"10px",overflow:"hidden"}}>
                    <Button type="primary" style={{float:"right"}} onClick={this.showEditModal.bind({})} icon="plus">新增转账</Button>
                    <Button type="primary" style={{float:"right"}} onClick={this.showAgentEditModal.bind({})} icon="plus">代理转账</Button>
                </div>
                <div style={{marginTop:10}}>
                    <Table 
                        rowKey={record => record.id}
                        columns={columns} 
                        dataSource={this.state.tableData} 
                        pagination={this.state.pagination} 
                        onChange={this.handleChange} />
                </div>
                <Modal
                    visible={this.state.editVisabled}
                    title="转账"
                    onOk={this.handleEditOk}
                    confirmLoading={this.state.confirmLoading}
                    onCancel={this.handleEditCancel}
                    footer={null}
                    >
                    <div style={{marginTop:30}}>
                        <EditForm handleEditCancel={this.handleEditCancel} handleEditOk={this.handleEditOk}/>
                    </div>
                </Modal>
                <Modal
                    visible={this.state.editAgentVisabled}
                    title="转账"
                    onOk={this.handleEditOk}
                    confirmLoading={this.state.confirmLoading}
                    onCancel={this.handleEditCancel}
                    footer={null}
                    >
                    <div style={{marginTop:30}}>
                        <EditAgentForm handleEditCancel={this.handleEditCancel} handleEditOk={this.handleEditOk} balance={this.state.balance}/>
                    </div>
                </Modal>
            </div>
        );
    }
};
export default TransferTable;