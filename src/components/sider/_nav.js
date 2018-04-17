const menuData = [
    {
        key: 'home',
        name: '我的概况',
        path: '/custom/index',
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
    }
]

export default menuData;
