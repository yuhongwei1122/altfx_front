import React, { Component } from 'react';
import { Button, Card, Row, Col, Table, Spin, message } from 'antd';
import axios from 'axios';
import qs from 'qs';

class CusIndex extends Component {
    constructor(props){
        super(props);
        this.state = {
            globalLoading: false,
            tableData: [],
            trade:{}
        }
    };
    toggleLoading = () => {
        this.setState({
            globalLoading: !this.state.globalLoading
        });
    };
    fetchData = (params = {}) => {
        axios.post('/api/profit/rank',qs.stringify({
			size: 20,  //每页数据条数
        })).then((res) => {
            if(Number(res.error.returnCode) === 0){
                this.setState({
                    tableData : res.data.result
                });
            }else{
                message.error(res.error.returnUserMessage);
            }
        });
    };
    handleRecharge = () => {
        this.props.history.push("/account/recharge");
    };
    handleGetCash = () => {
        this.props.history.push("/account/withdraw");
    };
    initCashAccount = () => {
        axios.post('/api/user/user-account')
        .then((res) => {
            this.setState({
                trade : {
                    balance: Number(res.data.balance) ? Number(res.data.balance).toFixed(2) : 0,
                    equity: Number(res.data.equity) ? Number(res.data.equity).toFixed(2) : 0,
                    margin: Number(res.data.margin) ? Number(res.data.margin).toFixed(2) : 0,
                    freeMargin: Number(res.data.freeMargin) ? Number(res.data.margin_free).toFixed(2) : 0,
                }
            });
        });
    };
    componentWillMount(){
        this.toggleLoading();
        this.fetchData();
        this.initCashAccount();
    };
    componentDidMount(){
        // console.log("did mount 中当前的页："+this.state.pagination.current);
        this.toggleLoading();
    };
    render() {
        const columns = [
            {
                title: '排名',
                dataIndex: 'order',
                key: 'order'
            },
            {
                title: '姓名',
                dataIndex: 'username',
                key: 'username'
            },
            {
                title: '收益金额($)',
                dataIndex: 'profit',
                key: 'profit',
            }, 
            {
                title: '收益率(%)',
                dataIndex: 'profit_rate',
                key: 'profit_rate',
            }
        ];
        return (
            <Spin tip="亲，正在努力加载中，请稍后..." spinning={this.state.globalLoading}>                                   
            <div className="overview">
                <div style={{marginTop:10}}>
                    <Row gutter={24} style={{marginBottom:20}}>
                        <Col span={6}>
                            <Button onClick={this.handleRecharge.bind(this)} type="primary" style={{marginRight:10}}>入金</Button>
                            <Button onClick={this.handleGetCash.bind(this)} >出金</Button>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={6}>
                            <Card title="余额">
                                <span style={{fontSize:"24px"}}>${this.state.trade.balance}</span>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card title="净值">
                                <span style={{fontSize:"24px"}}>${this.state.trade.equity}</span>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card title="保证金">
                                <span style={{fontSize:"24px"}}>${this.state.trade.margin}</span>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card title="可用余额">
                                <span style={{fontSize:"24px"}}>${this.state.trade.freeMargin}</span>
                            </Card>
                        </Col>
                    </Row>
                </div>
                
                <Card title="昨日收益排行" style={{marginTop:20,marginBottom:30}}>
                    <Table 
                    rowKey={record => record.order}
                    columns={columns} 
                    dataSource={this.state.tableData} 
                    pagination={false} />
                </Card>
            </div>
            </Spin>
        );
    }
};
export default CusIndex;