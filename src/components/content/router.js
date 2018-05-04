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
        path: '/agent/index',
        name: '我的概况',
        private: true,
        component: () => import('../../views/agent')
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
    },
    {
        path: '/account/withdraw',
        name: '账户出金',
        private: true,
        component: () => import('../../views/account/withdraw')
    },
    {
        path: '/baseinfo',
        name: '基本信息',
        private: true,
        component: () => import('../../views/account/base')
    },
    {
        path: '/report/index',
        name: '返佣报告',
        private: true,
        component: () => import('../../views/report/index')
    },
    {
        path: '/agent/withdraw',
        name: '代理出金',
        private: true,
        component: () => import('../../views/agent/withdraw')
    },
    {
        path: '/bonus/index',
        name: '我的奖金',
        private: true,
        component: () => import('../../views/bonus/index')
    },
    {
        path: '/perform/index',
        name: '业绩管理',
        private: true,
        component: () => import('../../views/perform/index')
    },
    {
        path: '/rule/index',
        name: '返佣规则',
        private: true,
        component: () => import('../../views/agent/rule')
    },
    {
        path: '/agent/url',
        name: '代理链接',
        private: true,
        component: () => import('../../views/agent/url')
    },
    {
        path: '/manage/same',
        name: '同名账户',
        private: true,
        component: () => import('../../views/manage/same')
    },
    {
        path: '/manage/trade_account/:unique_code/:username',
        name: '交易账户列表',
        private: true,
        component: () => import('../../views/manage/account')
    },
    {
        path: '/manage/apply/:unique_code/:username',
        name: '申请同名账户',
        private: true,
        component: () => import('../../views/manage/apply_same')
    },
    {
        path: '/manage/account/:unique_code/:username',
        name: '查看交易账户列表',
        private: true,
        component: () => import('../../views/manage/member_account')
    },
    {
        path: '/manage/member',
        name: '会员结构',
        private: true,
        component: () => import('../../views/manage/member')
    },
    {
        path: '/rakeback/index',
        name: '返佣概况',
        private: true,
        component: () => import('../../views/agent/index')
    },
]
