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
    let userinfo = {};
    if(sessionStorage.getItem("altfx_user")){
        userinfo = JSON.parse(sessionStorage.getItem("altfx_user"));
    }
    console.log(config);
    let data = {};
    if(config.data!=undefined){
        console.log(config.data);
        data = config.data;
    }
    if(userinfo['token']!= undefined && userinfo['token']!= '' && userinfo['token']!= null){
        data.token = userinfo['token'];
    }else{
        data.token = "";
    }
    if(config.method === 'post'){
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
    console.log(sign);
    sign = md5(sign.join("|"));
    // console.log(sign);
    data['sign'] = sign;
    // console.log(config.data);
    config.data = data;
    return config;
}, function (error) {
    // Do something with request error
    console.log("报错");
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
