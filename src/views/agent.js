import React, { Component } from 'react';
import { Button, Card, Row, Col, Table } from 'antd';
import axios from 'axios';
import qs from 'qs';
import {Chart, Axis, Tooltip, Geom} from "bizcharts";//引入图表插件

const scale = {
    year: { alias: '日期' },
    commission: { alias: '返佣金额' }
};
const label = {
    textStyle: {
      textAlign: 'center', // 文本对齐方向，可取值为： start center end
      fontSize: '12', // 文本大小
      rotate: 30, 
      textBaseline: 'top' // 文本基准线，可取 top middle bottom，默认为middle
    },
    autoRotate: true
};
class AgentIndex extends Component {
    constructor(props){
        super(props);
        this.state = {
            tableData: {},
            trade: {},
            employee: false,
            trends:{}
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
    getSevenTrends = () => {
        axios.post('/api/commission/seven-trends')
        .then((res) => {
            console.log("七日反佣",res.data);
            this.setState({
                trends : res.data
            });
        });
    };
    componentDidMount(){
        this.getSevenTrends();
        let info = {};
        if(sessionStorage.getItem("altfx_user")){
            info = JSON.parse(sessionStorage.getItem("altfx_user"));
        }
        this.fetchData();
        if(Number(info.employee) === 0){
            this.initCashAccount();
        }
        this.setState({
            employee: Number(info.employee) === 0 ? false : true
        });
    };
    render() {
        let chartData = [];
        let trends = this.state.trends || {};
        console.log(trends);
        if(Object.keys(trends).length > 0){
            Object.keys(trends).forEach((key)=>{
                chartData.push({year:key.substr(5),commission:trends[key].commission});
            });
        }
        console.log(chartData);
        return (
            <div className="overview">
                {!this.state.employee ? <div style={{marginTop:10}}>
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
                </div> : null}
                <Card title="近7日返佣金额趋势" style={{marginTop:20,marginBottom:30}}>
                    <Chart scale={scale} height={400} data={chartData} forceFit>
                        <Axis name="year" label={label}/>
                        <Axis name="commission" />
                        <Tooltip crosshairs={{type : "y"}}/>
                        <Geom type="interval" position="year*commission" />
                    </Chart>
                </Card>
            </div>
        );
    }
};
export default AgentIndex;