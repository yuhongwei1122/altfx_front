import React from 'react';
import ReactDOM from 'react-dom';
import Loadable from 'react-loadable';
import {Spin} from 'antd';
import {HashRouter, Route, Switch} from 'react-router-dom';
import axios from 'axios';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import moment from 'moment';
import md5 from 'md5';
// 异步请求响应拦截器
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.interceptors.response.use(function (response) {
    // Do something with response data
    console.log(response);
    if(response.data.error && Number(response.data.error.returnCode) === 99){
        console.log("登陆失效");
        // window.location.href = "/";
    }else{
        if(Number(response.data.error.returnCode) === 0 || Number(response.data.error.returnCode) === 1){
            return response.data;
        }else{
            console.log("错误");
            return response.data;
        }
    }
}, function (error) {
    // Do something with response error
    return Promise.reject(error);
});
// 异步请求请求拦截器
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    let userinfo = {};
    if(sessionStorage.getItem("altfx_user")){
        userinfo = JSON.parse(sessionStorage.getItem("altfx_user"));
    }
    console.log(config);
    let data = {};
    if(config.data !== undefined){
        let strs = config.data.split("&");
        for (var i = 0; i < strs.length; i++) {
            data[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
        }
        // data = config.data;
    }
    if(config.method === 'post'){
        if(!data['token']){
            data.token = userinfo['token'] ? userinfo['token'] : "";
        }
        if(!data['account']){
            data['account'] = userinfo['account'] ? userinfo['account'] : "";
        }
    }
    data['ts'] = moment().unix();
    const keys = Object.keys(data).sort();
    console.log(keys);
    let sign = [];
    keys.forEach((key)=>{
        sign.push(data[key]);
    });
    sign.push("crm-front");
    // console.log(sign);
    console.log(sign.join("|"));
    sign = md5(sign.join("|"));
    // console.log(sign);
    data['sign'] = sign;
    // console.log(data);
    let keystr = [];
    Object.keys(data).forEach((key)=>{
        keystr.push(key + "=" + data[key]);
    });
    config.data = keystr.join("&");
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    return config;
}, function (error) {
    // Do something with request error
    console.log("报错");
    return Promise.reject(error);
});
const MyLoadingComponent = ({ isLoading, error }) => {
    // Handle the loading state
    if (isLoading) {
        return (
            <div className="loading-box">
                <Spin style={{margin: "0 auto"}} tip="亲，正在努力加载中，请稍后..."></Spin>;
            </div>
        );
    }
    // Handle the error state
    else if (error) {
        return <div>Sorry, there was a problem loading the page.</div>;
    }
    else {
        return null;
    }
};

const AsyncLogin = Loadable({
    loader: () => import('./views/login/login'),
    loading: MyLoadingComponent
});
const AsyncRegister = Loadable({
    loader: () => import('./views/register/customer'),
    loading: MyLoadingComponent
});
const AsyncApp = Loadable({
    loader: () => import('./components/content/content'),
    loading: MyLoadingComponent
});
const AsyncConfirm = Loadable({
    loader: () => import('./views/register/confirm'),
    loading: MyLoadingComponent
});
const AsyncAgent = Loadable({
    loader: () => import('./views/register/agent'),
    loading: MyLoadingComponent
});
const AsyncDemo = Loadable({
    loader: () => import('./views/register/demo'),
    loading: MyLoadingComponent
});
ReactDOM.render(
    <HashRouter>
        <Switch>
            <Route path="/login" component={AsyncLogin} />
            <Route path="/register/cus" component={AsyncRegister} />
            <Route path="/register/agent" component={AsyncAgent} />
            <Route path="/register/demo" component={AsyncDemo} />
            <Route path="/confirm/:status" component={AsyncConfirm} />
            <Route path="/" name="content" component={AsyncApp}></Route>
        </Switch>
    </HashRouter>, 
    document.getElementById('root')
);
registerServiceWorker();
