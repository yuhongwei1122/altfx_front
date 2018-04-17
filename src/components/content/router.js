export default [
    {
        path: '/overview',
        name: '系统首页',
        private: true,
        component: () => import('../../views/overview')
    },
    {
        path: '/account/transfer',
        name: '帐户转账',
        private: true,
        component: () => import('../../views/account/transfer')
    },
    {
        path: '/custom/index',
        name: '我的概况',
        private: true,
        component: () => import('../../views/customer')
    },
    {
        path: '/trade/history',
        name: '历史成交',
        private: true,
        component: () => import('../../views/trade/index')
    },
    {
        path: '/account/bank',
        name: '银行信息',
        private: true,
        component: () => import('../../views/account/bank')
    },
    {
        path: '/cash/history',
        name: '账户流水',
        private: true,
        component: () => import('../../views/account/flow')
    },
    {
        path: '/account/recharge',
        name: '账户入金',
        private: true,
        component: () => import('../../views/account/recharge')
    }
]
