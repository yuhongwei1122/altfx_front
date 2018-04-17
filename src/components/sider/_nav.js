const menuData = [
    {
        key: 'home',
        name: '我的概况',
        path: '/custom/index',
        icon: 'home',
    },
    {
        key: 'agent',
        name: '我的概况',
        path: '/agent/index',
        icon: 'home',
    },
    {
        key: 'register',
        name: '交易概况',
        path: '/trade',
        icon: 'usergroup-add',
        children:[
            {
                key: 'register',
                name: '历史成交',
                path: '/trade/history',
                icon: 'usergroup-add',
            }
        ]
    },
    {
        key: 'report',
        name: '返佣概况',
        path: '/report',
        icon: 'usergroup-add',
        children:[
            {
                key: 'report',
                name: '返佣报告',
                path: '/report/index',
                icon: 'home',
            },
            {
                key: 'rule',
                name: '返佣规则',
                path: '/rule/index',
                icon: 'home',
            },
            {
                key: 'agenturl',
                name: '代理链接',
                path: '/agent/url',
                icon: 'home',
            },
        ]
    },
    {
        key: 'register',
        name: '账户中心',
        path: '/account',
        icon: 'usergroup-add',
        children:[
            {
                key: 'recharge',
                name: '账户入金',
                path: '/account/recharge',
                icon: 'home'
            },
            {
                key: 'uwithdraw',
                name: '账户出金',
                path: '/account/withdraw',
                icon: 'home'
            },
            {
                key: 'awithdraw',
                name: '代理出金',
                path: '/agent/withdraw',
                icon: 'home'
            },
            {
                key: 'bonus',
                name: '我的奖金',
                path: '/bonus/index',
                icon: 'home'
            },
            {
                key: 'register',
                name: '转账申请',
                path: '/account/transfer',
                icon: 'usergroup-add',
            },
            {
                key: 'histroy',
                name: '账户流水',
                path: '/cash/history',
                icon: 'usergroup-add',
            },
            {
                key: 'bank',
                name: '银行信息',
                path: '/account/bank',
                icon: 'usergroup-add',
            }
        ]
    },
    {
        key: 'manage',
        name: '客户管理',
        path: '/manage',
        icon: 'usergroup-add',
        children:[
            {
                key: 'samecus',
                name: '同名账户',
                path: '/manage/same',
                icon: 'home',
            }
        ]
    },
    {
        key: 'home',
        name: '业绩管理',
        path: '/perform/index',
        icon: 'home',
    },
]

export default menuData;
