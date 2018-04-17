import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter, Route, Switch} from 'react-router-dom';
import axios from 'axios';
import './index.css';
import App from './components/content/content';
import Login from './views/login/login';
import Register from './views/register/customer';
import Confirm from './views/register/confirm';
import registerServiceWorker from './registerServiceWorker';
import moment from 'moment';
import md5 from 'md5';
// 异步请求响应拦截器
axios.interceptors.response.use(function (response) {
    // Do something with response data
    // console.log(response);
    if(response.data.error && Number(response.data.error.returnCode) === 5002){
        console.log("登陆失效");
        window.location.href = response.data.data.loginRedirectUrl;
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
    console.log(config);
    const userinfo = JSON.parse(sessionStorage.getItem("altfx_user"));
    config.data['token'] = userinfo['token'] ? userinfo['token'] : "";
    if(config.method === 'post'){
        if(!config.data['account']){
            config.data['account'] = userinfo['account'] ? userinfo['account'] : "";
        }
    }
    config.data['ts'] = moment().unix();
    const keys = Object.keys(config.data).sort();
    console.log(keys);
    let sign = [];
    keys.forEach((key)=>{
        sign.push(config.data[key]);
    });
    sign.push("crm-front");
    console.log(sign);
    sign = md5(sign.join("|"));
    console.log(sign);
    config.data['sign'] = sign;
    console.log(config.data);
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});
ReactDOM.render(
    <HashRouter>
        <Switch>
            <Route path="/login" component={Login} />
            <Route path="/register/cus" component={Register} />
            <Route path="/confirm/:status" component={Confirm} />
            <Route path="/" name="content" component={App}></Route>
        </Switch>
    </HashRouter>, 
    document.getElementById('root')
);
registerServiceWorker();
