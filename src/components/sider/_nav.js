const menuData = [
    {
        key: 'home',
        name: '我的概况',
        path: '/custom/index',
        icon: 'home',
        role: ["custom"]
    },
    {
        key: 'agent',
        name: '我的概况',
        path: '/agent/index',
        icon: 'home',
        role: ["agent","employee","admin"]
    },
    {
        key: 'register',
        name: '交易概况',
        path: '/trade',
        icon: 'usergroup-add',
        role: ["custom"],
        children:[
            {
                key: 'register',
                name: '历史成交',
                path: '/trade/history',
                icon: 'usergroup-add',
                role: ["custom"]
            }
        ]
    },
    {
        key: 'report',
        name: '返佣中心',
        path: '/report',
        icon: 'usergroup-add',
        role: ["agent","employee","admin"],
        children:[
            {
                key: 'rakeback',
                name: '返佣概况',
                path: '/rakeback/index',
                icon: 'home',
                role: ["agent","employee","admin"]
            },
            {
                key: 'report',
                name: '返佣报告',
                path: '/report/index',
                icon: 'home',
                role: ["agent","employee","admin"]
            },
            {
                key: 'rule',
                name: '返佣规则',
                path: '/rule/index',
                icon: 'home',
                role: ["agent","employee","admin"]
            },
            {
                key: 'agenturl',
                name: '代理链接',
                path: '/agent/url',
                icon: 'home',
                role: ["agent","employee","admin"]
            },
        ]
    },
    {
        key: 'register',
        name: '账户中心',
        path: '/account',
        icon: 'usergroup-add',
        role: ["custom","agent"],
        children:[
            {
                key: 'uwithdraw',
                name: '账户出金',
                path: '/account/withdraw',
                icon: 'home',
                role: ["custom"]
            },
            {
                key: 'awithdraw',
                name: '代理出金',
                path: '/agent/withdraw',
                icon: 'home',
                role: ["agent"]
            },
            {
                key: 'bonus',
                name: '我的奖金',
                path: '/bonus/index',
                icon: 'home',
                role: ["agent"]
            },
            {
                key: 'register',
                name: '转账申请',
                path: '/account/transfer',
                icon: 'usergroup-add',
                role: ["custom","agent"]
            },
            {
                key: 'histroy',
                name: '账户流水',
                path: '/cash/history',
                icon: 'usergroup-add',
                role: ["custom","agent"]
            },
            {
                key: 'bank',
                name: '银行信息',
                path: '/account/bank',
                icon: 'usergroup-add',
                role: ["custom","agent"]
            }
        ]
    },
    {
        key: 'manage',
        name: '客户管理',
        path: '/manage',
        icon: 'usergroup-add',
        role: ["agent","employee","admin"],
        children:[
            {
                key: 'samecus',
                name: '同名账户',
                path: '/manage/same',
                icon: 'home',
                role: ["agent","employee","admin"]
            },
            {
                key: 'member',
                name: '会员结构',
                path: '/manage/member',
                icon: 'home',
                role: ["agent","employee","admin"]
            }
        ]
    },
    {
        key: 'home',
        name: '业绩管理',
        path: '/perform/index',
        icon: 'home',
        role: ["agent","employee","admin"]
    },
]

export default menuData;
