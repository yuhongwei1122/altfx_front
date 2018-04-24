const express  = require("express");
const app = express();
const port = process.env.PORT || 5000;
//登录部分
app.post('/api/login/login',(req, res) => {
    res.send(require('./data/login.json'));
});
app.post('/api/login/out',(req, res) => {
    res.send(require('./data/common/ok.json'));
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
    res.send(require('./data/account/agentAccount.json'));
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
//申请出金
app.post('/api/cash/withdraw',(req, res) => {
    res.send(require('./data/account/withdraw.json'));
});
//补全银行卡信息
app.post('/api/cash/update-card',(req, res) => {
    res.send(require('./data/common/ok.json'));
});
//修改密码
app.post('/api/user/update-pwd',(req, res) => {
    res.send(require('./data/common/ok.json'));
});
//返佣报告
app.post('/api/commission/order-detail',(req, res) => {
    res.send(require('./data/report/list.json'));
});
//奖金发放历史
app.post('/api/bonus/detail',(req, res) => {
    res.send(require('./data/bonus/list.json'));
});
app.post('/api/bonus/summary',(req, res) => {
    res.send(require('./data/bonus/summary.json'));
});
//业绩管理
app.post('/api/report/agent-summary',(req, res) => {
    res.send(require('./data/report/agent-summary.json'));
});
app.post('/api/report/customer-summary',(req, res) => {
    res.send(require('./data/report/customer-summary.json'));
});
app.post('/api/report/current-user',(req, res) => {
    res.send(require('./data/report/current-user.json'));
});
//返佣规则
app.post('/api/commission/configuration',(req, res) => {
    res.send(require('./data/agent/configuration.json'));
});
//同名账户
app.post('/api/member/customer-list',(req, res) => {
    res.send(require('./data/agent/customer-list.json'));
});
//修改点差类型
app.post('/api/member/update-commission-model',(req, res) => {
    res.send(require('./data/common/ok.json'));
});
//交易账户列表
app.post('/api/member/mt4-login-list',(req, res) => {
    res.send(require('./data/agent/mt4_login_list.json'));
});
//申请同名账户
app.post('/api/user/mt4-apply',(req, res) => {
    res.send(require('./data/common/ok.json'));
});
//会员结构
app.post('/api/member/subordinate',(req, res) => {
    res.send(require('./data/agent/subordinate.json'));
});
//升级员工
app.post('/api/member/apply-employee',(req, res) => {
    res.send(require('./data/common/ok.json'));
});
//获取7日反佣
app.post('/api/commission/seven-trends',(req, res) => {
    res.send(require('./data/agent/seven-trends.json'));
});
//组织关系图
app.post('/api/commission/organization',(req, res) => {
    res.send(require('./data/agent/organization.json'));
});
//获取昨日返佣
app.post('/api/commission/distribute',(req, res) => {
    res.send(require('./data/agent/distribute.json'));
});
//账户流水
app.post('/api/cash/record',(req, res) => {
    res.send(require('./data/cash/record.json'));
});
app.listen(port, () => {console.log(`Lisening mockServer on port ${port}`)});

