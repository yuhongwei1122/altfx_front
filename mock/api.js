const express  = require("express");
const app = express();
const port = process.env.PORT || 5000;
//登录部分
app.post('/login/login',(req, res) => {
    res.send(require('./data/login.json'));
});
app.post('/api/login/find-pwd',(req, res) => {
    res.send(require('./data/common/ok.json'));
});
app.post('/api/register/account-check',(req, res) => {
    res.send(require('./data/register/forget.json'));
});
//公共部分
app.post('/api/image/get-url',(req, res) => {
    res.send(require('./data/common/imgurl.json'));
});
//-----注册部分----
app.post('/api/register/account-check',(req, res) => {
    res.send(require('./data/common/ok.json'));
});
app.post('/api/register/mail-check',(req, res) => {
    res.send(require('./data/common/ok.json'));
});
app.post('/api/user/detail',(req, res) => {
    res.send(require('./data/account/detail.json'));
});
//转账部分
app.get('/api/account/transfer',(req, res) => {
    res.send(require('./data/account/transfer.json'));
});
//普通用户获取帐户余额信息
app.post('/api/user/user-account',(req, res) => {
    res.send(require('./data/account/userAccount.json'));
});
//代理获取帐户余额信息
app.post('/api/user/agent-account',(req, res) => {
    res.send(require('./data/account/userAccount.json'));
});
//获取登录用户下的所有的mt4的帐户
app.post('/api/user/getmt4',(req, res) => {
    res.send(require('./data/account/MT4List.json'));
});
//普通用户确认转账
app.post('/api/user/transfer_confirm',(req, res) => {
    res.send(require('./data/common/ok.json'));
});
//用户交易历史
app.post('/api/trade/record',(req, res) => {
    res.send(require('./data/trade/record.json'));
});
//银行卡
app.post('/api/cash/card-list',(req, res) => {
    res.send(require('./data/account/bank.json'));
});
//排行榜
app.post('/api/profit/rank',(req, res) => {
    res.send(require('./data/trade/rank.json'));
});
//入金生成流水号
app.post('/api/cash/create-order',(req, res) => {
    res.send(require('./data/cash/order.json'));
});
//汇率查询
app.post('/api/cash/rate-query',(req, res) => {
    res.send(require('./data/cash/rate.json'));
});
//申请入金
app.post('/api/cash/charge',(req, res) => {
    res.send(require('./data/cash/charge.json'));
});
app.listen(port, () => {console.log(`Lisening mockServer on port ${port}`)});

