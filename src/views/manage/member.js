import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Modal, Tag, Notification, Select, message, Spin } from 'antd';
import axios from 'axios';
import qs from 'qs';
import DateFormate from '../../components/tool/DateFormatPan';
import SearchForm from './search';
const ButtonGroup = Button.Group;
const Option = Select.Option;

class MemberTable extends Component {
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
            province:false,
            employee: 0,
            uniqueList: [],
            confirmLoading: false,
            editVisabled: false,
            unique_code: "",
            employee_code:""
        }
    };
    toggleLoading = () => {
        this.setState({
            globalLoading: !this.state.globalLoading
        });
    };
    fetchData = (params = {}) => {
        // console.log("fetchData中page=："+this.state.pagination.current);
        let info = {};
        if(sessionStorage.getItem("altfx_user")){
            info = JSON.parse(sessionStorage.getItem("altfx_user"));
        }
        axios.post('/api/member/subordinate',qs.stringify({
            login_unique_code: info.unique_code,
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
                    tableData : res.data.result,
                    uniqueList : res.data.invite_relation
                });
            }else{
                message.error(res.error.returnUserMessage);
            }
        });
    };
    handleSearch = (params) => {
        this.fetchData({page:1,...params});
    };
    handleEmployee = (unique_code) => {
        this.setState({
            editVisabled: true,
            employee_code: unique_code
        });
    };
    handleEditOk = ()=>{
        this.setState({
            confirmLoading: true
        });
        axios.post('/api/member/apply-employee',qs.stringify({
            unique_code: this.state.unique_code,
            agent_code: this.state.employee_code
        })).then((res) => {
            if(Number(res.error.returnCode) === 0){
                Notification.success({
                    message: '成功',
                    description: '该代理已升级为员工',
                });
                this.fetchData({page:1,unique_code:this.state.unique_code});
            }else{
                message.error(res.error.returnUserMessage);
            }
            this.setState({
                editVisabled: false,
                employee_code: "",
                confirmLoading:false
            });
        });
    };
    handleEditCancel = () => {
        this.setState({
            editVisabled: false,
            employee_code: "",
            confirmLoading:false
        });
    };
    handleCheckEmoloyee = (employee) => {
        if(this.state.province){//如果是省代
            if(Number(this.state.employee) === 1){
                return true;
            }else{
                if(this.state.uniqueList.length > 1){
                    return true;
                }else{
                    if(Number(employee) === 1){
                        return true;
                    }else{
                        return false;
                    }
                }
            }
        }else{
            return true;
        }
    };
    componentWillMount(){
        this.toggleLoading();
        let info = {};
        if(sessionStorage.getItem("altfx_user")){
            info = JSON.parse(sessionStorage.getItem("altfx_user"));
        }
        if(info.invite_code === "8888888"){
            this.setState({
                province: true,
                employee: info.employee,
                unique_code: info.unique_code
            });
        }else{
            this.setState({
                province: false,
                employee: info.employee,
                unique_code: info.unique_code
            });
        }
        // console.log("did mount 中当前的页："+this.state.pagination.current);
        this.fetchData({page:1,unique_code:info.unique_code});
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
                key: 'unique_code',
                render: (text,row) => {
                    if(Number(row.subordinate) > 0){
                        return <span>{text}<Tag color="purple">{row.subordinate}</Tag></span>
                    }else{
                        return text
                    }
                }
            }, 
            {
                title: 'CRM账户名',
                dataIndex: 'account',
                key: 'account'
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
                        {(row.unique_code.indexOf("8") === 0 || row.unique_code.indexOf("6") === 0) ? 
                            Number(row.subordinate) > 0 ? <Button style={{lineHeight:0}} type="primary" icon="check" onClick={this.handleSearch.bind(this,{"unique_code":row.unique_code})}>查看下级用户</Button> :null : 
                            <Link to={{pathname:'/manage/account/'+row.unique_code+'/'+row.account}}><Button style={{lineHeight:0}} type="primary" icon="check">查看交易账户</Button></Link>
                        }
                        {!this.handleCheckEmoloyee(row.employee) ? <Button style={{lineHeight:0}} onClick={this.handleEmployee.bind(this,row.unique_code)} type="danger" icon="edit">升级员工</Button> : null}
                    </ButtonGroup>
                )
            }
        ];
        const list = this.state.uniqueList || [];
        const formItems = list.map((item) => {
            return <Tag color="blue" key={item} onClick={this.handleSearch.bind(this,{"unique_code":item})}>{item}&gt;</Tag>;
        });
        return (
            <Spin tip="Loading..." spinning={this.state.globalLoading}>                                                
            <div className="overview" style={{marginTop:"15px"}}>
                <div style={{overflow:"hidden"}}>
                    <SearchForm handleSearch={this.handleSearch}/>
                </div>    
                <div>
                    <span style={{marginLeft:40,color:"#000",marginRight:5}}>层级结构：</span>{formItems}
                </div>
                <div style={{marginTop:10}}>
                    <Table 
                        rowKey={record => record.unique_code}
                        columns={columns} 
                        dataSource={this.state.tableData} 
                        pagination={this.state.pagination} 
                        onChange={this.handleChange}/>
                </div>   
                <Modal
                    visible={this.state.editVisabled}
                    title="升级员工"
                    onOk={this.handleEditOk}
                    confirmLoading={this.state.confirmLoading}
                    onCancel={this.handleEditCancel}
                    okText="确定"
                    cancelText="取消"
                    >
                    <div>
                        您确认将代理：{this.state.employee_code}，升级为员工吗？
                    </div>
                </Modal>            
            </div>
            </Spin>
        );
    }
};
export default MemberTable;