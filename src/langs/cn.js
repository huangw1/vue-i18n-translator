/**
 * @Author: huangw1
 * @Date: 2019/8/5 19:41
 */

/**
 * ￣□￣｜｜
 * code completion
 */
const kv = {
    // universal
    locale: {
        current: '当前切换语言，中文'
    },

    placeholder: {
        input: '请输入',
        select: '请选择',
        inputField: '请输入{field}',
        selectField: '请选择{field}'
    },

    validator: {
        required: '必须项',
        max: '最多{field}个字符'
    },

    date: {
        just: '刚刚',
        year: '年',
        month: '月',
        day: '日',
        hour: '时',
        minute: '分',

        minuteAgo: '分钟前',
        hourAgo: '小时前',
        yesterday: '昨天',

        to: '至',
        begin: '开始时间',
        end: '结束时间'
    },

    button: {
        ok: '确定',
        cancel: '取消',
        close: '关闭',

        reset: '重置',
        clear: '清空',
        query: '查询',
        search: '搜索',
        create: '新增',

        set: '设置',
        view: '查看',
        edit: '编辑',
        save: '保存',
        more: '更多',
        remove: '删除',
        operate: '操作'
    },

    network: {
        internal: '服务器出了点问题',
        notFound: '资源不存在',
        forbidden: '你无权限访问',
        unauthorized: '你还未登录'
    },

    message: {
        updateSuccess: '更新成功',
        removeSuccess: '删除成功',
        createSuccess: '创建成功',
        confirmUpdate: '确认更新吗',
        confirmRemove: '确认删除吗'
    },

    menu: {
        dashboard: '工作台',

        user: '用户管理',
        userList: '用户信息',
        userRole: '角色管理',
        userGroup: '组别信息',
        userPermission: '权限管理',

        alarm: '监控管理',
        alarmRecord: '告警记录',
        alarmConfigure: '告警配置'
    },

    // page
    alarm: {
        prefix: '告警策略：人员时效监控',

        strategyName: '策略名称',
        strategyType: '策略类型',
        strategyGroup: '所属组别',
        strategyRegion: '所属区域',
        strategyRemark: '备注',
        strategyCreator: '创建人',
        strategyCreateTime: '创建时间',
        strategyEnableOrDisable: '是否开启',

        alarmStrategy: '告警策略',
        alarmBasic: '基础信息',
        alarmScheduled: '监控周期',
        alarmRange: '监控范围',
        alarmCondition: '触发条件',
        alarmMode: '告警方式',

        per: '每',
        ticketNum: '工单数量',
        higher: '达到',
        lower: '低于',
        repeatTime: '重复次数'
    }
};

export default kv
