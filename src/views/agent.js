import React, { Component } from 'react';
import { Button, Card, Row, Col, Table } from 'antd';
import axios from 'axios';

class AgentIndex extends Component {
    constructor(props){
        super(props);
        this.state = {
            tableData: {},
            trade: {}
        }
    };
    fetchData = (params = {}) => {
        axios.post('/api/commission/seven-trends')
        .then((res) => {
            this.setState({
                tableData : res.data
            });
        });
    };
    handleRecharge = () => {
        this.props.history.push("/cash/history");
    };
    handleGetCash = () => {
        this.props.history.push("/agent/withdraw");
    };
    initCashAccount = () => {
        axios.post('/api/user/agent-account')
        .then((res) => {
            this.setState({
                trade : {
                    balance: Number(res.data.balance) ? Number(res.data.balance).toFixed(2) : 0,
                    month_commission: Number(res.data.month_commission)? Number(res.data.month_commission).toFixed(2) : 0,
                    total_withdraw: Number(res.data.total_withdraw)? Number(res.data.total_withdraw).toFixed(2) : 0,
                    total_commission: Number(res.data.total_commission)? Number(res.data.total_commission).toFixed(2) : 0,
                }
            });
        });
    };
    componentDidMount(){
        this.fetchData();
        this.initCashAccount();
    };
    render() {
        return (
            <div className="overview">
                <div style={{marginTop:10}}>
                    <Row gutter={24} style={{marginBottom:20}}>
                        <Col span={6}>
                            <Button onClick={this.handleRecharge.bind(this)} type="primary" style={{marginRight:10}}>流水</Button>
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
                            <Card title="当月返佣金额">
                                <span style={{fontSize:"24px"}}>${this.state.trade.month_commission}</span>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card title="已提现金额">
                                <span style={{fontSize:"24px"}}>${this.state.trade.total_withdraw}</span>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card title="累计返佣金额">
                                <span style={{fontSize:"24px"}}>${this.state.trade.total_commission}</span>
                            </Card>
                        </Col>
                    </Row>
                </div>
                <Card title="近7日返佣金额趋势" style={{marginTop:20,marginBottom:30}}>
                    我是图表
                </Card>
            </div>
        );
    }
};
export default AgentIndex;