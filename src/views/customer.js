import React, { Component } from 'react';
import { Button, Card, Row, Col, Table } from 'antd';
import axios from 'axios';

class CusIndex extends Component {
    constructor(props){
        super(props);
        this.state = {
            tableData: []
        }
    };
    fetchData = (params = {}) => {
        axios.post('/api/profit/rank',{
            params: {
				limit: 20,  //每页数据条数
            }
        }).then((res) => {
            this.setState({
                tableData : res.data.result
            });
        });
    };
    handleRecharge = () => {
        this.props.history.push("/recharge");
    };
    handleGetCash = () => {
        this.props.history.push("/overview");
    };
    componentDidMount(){
        this.fetchData();
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
            <div className="overview">
                <div style={{marginTop:10}}>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Card title="余额">
                                <span style={{fontSize:"24px"}}>$100</span>
                                <Button onClick={this.handleRecharge.bind(this)} type="primary" style={{float:"right",marginLeft:10}}>入金</Button>
                                <Button onClick={this.handleGetCash.bind(this)} style={{float:"right"}}>出金</Button>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card title="净值">
                                <span style={{fontSize:"24px"}}>$100</span>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card title="保证金">
                                <span style={{fontSize:"24px"}}>$100</span>
                            </Card>
                        </Col>
                    </Row>
                </div>
                <Card title="昨日收益排行" style={{marginTop:20,marginBottom:30}}>
                    <Table 
                    rowKey={record => record.id}
                    columns={columns} 
                    dataSource={this.state.tableData} 
                    pagination={false} />
                </Card>
            </div>
        );
    }
};
export default CusIndex;