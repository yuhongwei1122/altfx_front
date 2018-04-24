import React, { Component } from 'react';
import { Card, message, Spin } from 'antd';
import axios from 'axios';
import qs from 'qs';
import {Chart, Axis, Geom, Tooltip, Coord, Legend, Label} from "bizcharts";//引入图表插件
import G6 from '@antv/g6';
import { DataView } from '@antv/data-set';

class AgentIndex extends Component {
    constructor(props){
        super(props);
        this.state = {
            globalLoading: false,
            distribut: [],
            employee: false,
            organ:{}
        }
    };
    toggleLoading = () => {
        this.setState({
            globalLoading: !this.state.globalLoading
        });
    };
    fetchData = () => {
        axios.post('/api/commission/organization')
        .then((res) => {
            if(Number(res.error.returnCode) === 0){
                this.setState({
                    organ : res.data
                });
                let data = res.data.filter(item => item.id)
                this.drawTree(data);
            }else{
                message.error(res.error.returnUserMessage);
            }
        });
    };
    
    getYesterdayTrends = () => {
        axios.post('/api/commission/distribute')
        .then((res) => {
            if(Number(res.error.returnCode) === 0){
                this.setState({
                    distribut : res.data
                });
            }else{
                message.error(res.error.returnUserMessage);
            }
        });
    };
    drawTree = (data) => {
        const tree = new G6.Tree({
            id: 'mountNode',            // 容器ID
            height: window.innerHeight,         // 画布高
            fitView: 'autoZoom', // 自动缩放
            layoutCfg: {
              // direction: 'LR', // 方向（LR/RL/H/TB/BT/V）
              getHGap: function(/* d */) { // 横向间距
                return 100;
              },
              getVGap: function(/* d */) { // 竖向间距
                return 10;
              },
            },
        });
        tree.source(this.state.organ);
        tree.node()
        .color(function (obj) {
            if(Number(obj.role) === 4){
                return "#bae7ff"
            }
        })
        .label(function (obj) {
            return obj.username+":"+obj.unique_code || "平台:8888888";
        }).style({
            fillOpacity: 1
        });
        tree.edge().shape('smooth');
        tree.render();
    };
    componentWillMount(){
        this.toggleLoading();
        this.getYesterdayTrends();
        this.fetchData();
    };
    componentDidMount(){
        this.toggleLoading();
    };
    render() {
        const data = [];
        let dis = this.state.distribut;
        dis.filter((item)=>{
            data.push({item:item.username,count:Number(item.total_commission)});
        });
        console.log(data);
        const dv = new DataView();
        dv.source(data).transform({
            type: 'percent',
            field: 'count',
            dimension: 'item',
            as: 'percent'
        });
        const cols = {
            percent: {
                formatter: val => {
                    val = (Number(val).toFixed(2) * 100) + '%';
                    return val;
                }
            }
        };
        return (
            <Spin tip="亲，正在努力加载中，请稍后..." spinning={this.state.globalLoading}>                                    
            <div className="overview">
                <Card title="昨日返佣来源分布" style={{marginTop:20,marginBottom:30}}>
                    <Chart height={300} data={dv} scale={cols} padding={[ 20, 20, 20, 20 ]} forceFit>
                        <Coord type='theta' radius={0.75} />
                        <Axis name="percent" />
                        <Tooltip 
                            showTitle={false} 
                            itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
                        />
                        <Geom
                            type="intervalStack"
                            position="percent"
                            color='item'
                            tooltip={['item*percent',(item, percent) => {
                                percent = Number(percent).toFixed(2) * 100 + '%';
                                return {
                                    name: item,
                                    value: percent
                                };
                            }]}
                            style={{lineWidth: 1,stroke: '#fff'}}
                            >
                            <Label content='percent' formatter={(val, item) => {
                                return item.point.item + ': ' + val;}} />
                        </Geom>
                    </Chart>
                </Card>
                <Card title="组织关系图" style={{marginTop:20,marginBottom:30}}>
                    <div id="mountNode" style={{minHeight:400}}></div>
                </Card>
            </div>
            </Spin>
        );
    }
};
export default AgentIndex;