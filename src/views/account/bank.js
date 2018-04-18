import React, { Component } from 'react';
import { Table, Button, Modal, Icon } from 'antd';
import axios from 'axios';
// import qs from 'qs';
import DateFormate from '../../components/tool/DateFormatPan';
import EditForm from './add_bank';
const ButtonGroup = Button.Group;

class BankTable extends Component {
    constructor(props){
        super(props);
        this.state = {
            tableData: [],
            editVisabled: false,
            editData: {}
        }
    };
    fetchData = (params = {}) => {
        // console.log("fetchData中page=："+this.state.pagination.current);
        // console.log(params);
        axios.post('/api/cash/card-list')
        .then((res) => {
            this.setState({
                tableData : res.data
            });
        });
    };
    handleEdit = () => {
        this.setState({
            editVisabled: true
        });
    };
    handleEditOk = () => {
        this.setState({
            editVisabled: false
        });
    };
    handleEditCancel = () => {
        this.setState({
            editVisabled: false
        });
    };
    componentDidMount(){
        this.fetchData();
        let info = {};
        if(sessionStorage.getItem("altfx_user")){
            info = sessionStorage.getItem("altfx_user");
        }
        this.setState({
            editData:{
                username: info.username || "altfx",
                "english_name": info.english_name || "altfx"
            }
        });
    };
    render() {
        const columns = [
            {
                title: '银行名称',
                dataIndex: 'bank_name',
                key: 'bank_name'
            },
            {
                title: '卡号',
                dataIndex: 'card_no',
                key: 'card_no',
            }, 
            {
                title: '发卡行',
                dataIndex: 'opening_bank',
                key: 'opening_bank',
            },
            {
                title: '添加时间',
                dataIndex: 'create_time',
                key: 'create_time',
                render:(text) => {
                    return <DateFormate date={text} format="yyyy-MM-dd hh:mm:ss"/>;
                }
            },
        ];
        return (
            <div className="overview">
                <div style={{overflow:"hidden"}}>
                    <Button onClick={this.handleEdit.bind(this)} style={{float:"right"}} type="primary"><Icon type="plus" />添加银行卡</Button>
                </div>
                <div style={{marginTop:10}}>
                    <Table 
                        rowKey={record => record.id}
                        columns={columns} 
                        dataSource={this.state.tableData} 
                        pagination={null}/>
                </div>
                <Modal
                    visible={this.state.editVisabled}
                    title="添加银行卡"
                    onOk={this.handleEditOk}
                    confirmLoading={this.state.confirmLoading}
                    onCancel={this.handleEditCancel}
                    footer={null}
                    >
                    <div>
                        <EditForm handleEditCancel={this.handleEditCancel} handleEditOk={this.handleEditOk} editData={this.state.editData}/>
                    </div>
                </Modal>
            </div>
        );
    }
};
export default BankTable;