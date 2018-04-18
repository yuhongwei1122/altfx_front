import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Modal, Tag, Notification, Select, Row, Col, Card } from 'antd';
import axios from 'axios';
import qs from 'qs';
import DateFormate from '../../components/tool/DateFormatPan';
import SearchForm from './search';
import ChangePointForm from './change_point';
const ButtonGroup = Button.Group;
const Option = Select.Option;

class TradeAccountTable extends Component {
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
            this.setState({
                pagination: {
                    total : Number(res.data.result_count),
                    ...pager
                },
                tableData : res.data.result
            });
        });
    };
    handleChangePoint = (unique_code,mt4_name,mt4_login,commission_model) => {
        this.setState({
            editVisabled: true,
            editData:{
                unique_code: unique_code,
                mt4_name: mt4_name,
                mt4_login: mt4_login,
                legacy_commission_model:commission_model
            }
        });
    };
    handleEditCancel = () => {
        this.setState({
            editVisabled: false,
            editData:{
                unique_code: "",
                mt4_name: "",
                mt4_login: "",
                legacy_commission_model:""
            }
        });
    };
    componentDidMount(){
        this.setState({
            unique_code: this.props.match.params.unique_code || "",
            username: this.props.match.params.username || "",
        });
        this.fetchData({page:1});
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
                width: "330px",
                render: (text, row, index) => (
                    <ButtonGroup> 
                        <Button style={{lineHeight:0}} type="danger" icon="edit" onClick={this.handleChangePoint.bind(this,row.unique_code,row.mt4_name,row.mt4_login,row.commission_model)}>修改点差类型</Button>
                    </ButtonGroup>
                )
            }
        ];
        return (
            <div className="overview" style={{marginTop:"30px"}}>
                <Row gutter={24}>
                    <Col span={8}>
                        <Card title="CRM账户名" style={{ width: 300 }}>
                            {this.state.username}
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="账户ID" style={{ width: 300 }}>
                            {this.state.unique_code}
                        </Card>
                    </Col>
                </Row>
                <div>
                    <Table 
                        rowKey={record => record.unique_code}
                        columns={columns} 
                        dataSource={this.state.tableData} 
                        pagination={this.state.pagination} 
                        onChange={this.handleChange}/>
                </div>  
                <Modal
                    visible={this.state.editVisabled}
                    title="修改点差类型"
                    footer={null}
                    >
                    <div>
                        <ChangePointForm handleEditCancel={this.handleEditCancel} handleEditOk={this.handleEditOk} editData={this.state.editData}/>
                    </div>
                </Modal>              
            </div>
        );
    }
};
export default TradeAccountTable;