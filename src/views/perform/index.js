import React, { Component } from 'react';
import { Button, Card, Row, Col, Table, Divider, Icon, Spin, message } from 'antd';
import axios from 'axios';
import qs from 'qs';
import AgentTable from './agent';
import CusTable from './customer';
import SearchForm from './search';

class PerformIndex extends Component {
    constructor(props){
        super(props);
        this.state = {
            globalLoading:false,
            trade: {},
            from: "",
            to:""
        }
    };
    toggleLoading = () => {
        this.setState({
            globalLoading: !this.state.globalLoading
        });
    };
    initCurrent = (params) => {
        axios.post('/api/report/current-user',qs.stringify({
            login_unique_code: JSON.parse(sessionStorage.getItem("altfx_user")).unique_code,
            unique_code: JSON.parse(sessionStorage.getItem("altfx_user")).unique_code,
            ...params
        }))
        .then((res) => {
            if(Number(res.error.returnCode) === 0){
                this.setState({
                    trade : {
                        total_customer_trade_profit: Number(res.data.total_customer_trade_profit) ? Number(res.data.total_customer_trade_profit).toFixed(2) : 0,
                        total_customer_trade_volume: Number(res.data.total_customer_trade_volume)? Number(res.data.total_customer_trade_volume).toFixed(2) : 0,
                        total_commission: Number(res.data.total_commission)? Number(res.data.total_commission).toFixed(2) : 0
                    }
                });
            }else{
                message.error(res.error.returnUserMessage);
            }
        });
    };
    handleSearch = (params) => {
        this.initCurrent(params);
        this.setState({
            from: params.from,
            to: params.to
        });
        this.refs.getAgentButton.handleSearch(params);
        this.refs.getCustomerButton.handleSearch(params);
    };
    componentWillMount(){
        this.toggleLoading();
        this.initCurrent({});
    };
    componentDidMount(){
        // console.log("did mount 中当前的页："+this.state.pagination.current);
        this.toggleLoading();
    };
    render() {
        return (
            <Spin tip="亲，正在努力加载中，请稍后..." spinning={this.state.globalLoading}>                                    
            <div className="overview">
                <div style={{marginTop:20}}>
                    <SearchForm handleSearch={this.handleSearch}/>
                </div>
                <div>
                    <Row gutter={24}>
                        <Col span={6}>
                            <Card title="累计盈亏金额">
                                <span style={{fontSize:"24px"}}>${this.state.trade.total_customer_trade_profit}</span>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card title="累计交易量">
                                <span style={{fontSize:"24px"}}>${this.state.trade.total_customer_trade_volume}</span>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card title="累计反佣金额">
                                <span style={{fontSize:"24px"}}>${this.state.trade.total_commission}</span>
                            </Card>
                        </Col>
                    </Row>
                </div>
                <Divider orientation="left"><Icon type="info-circle-o"></Icon>下级代理或员工业绩</Divider>
                <div>
                    <AgentTable ref="getAgentButton" from={this.state.from} to={this.state.to}/>
                </div>
                <Divider orientation="left"><Icon type="info-circle-o"></Icon>下级直客贡献</Divider>
                <div>
                    <CusTable ref="getCustomerButton" from={this.state.from} to={this.state.to}/>
                </div>
            </div>
            </Spin>
        );
    }
};
export default PerformIndex;