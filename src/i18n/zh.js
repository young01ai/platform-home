/*
 * @Author: zuoyuxing001
 * @Date: 2023-11-13 19:38:27
 * @LastEditors: zuoyuxing001
 * @LastEditTime: 2023-11-20 11:11:23
 * @FilePath: /platform-assistant/src/i18n/zh.js
 * @Description: 
 */

const zh = {
    page: {
        title: ' Chat模型体验',
        pageError: "出错了！",
        page404: "404 页面不存在",
        backHome: "回到首页",
    },
    header: {
        chat: "聊天模式",
        playground: "开发模式",
        stableDiffusion: 'AI绘图',
        logout: "退出登录",
        confirmLogout: "确认退出登录",
        logoutInfo: "退出登录将终止您在网页中的登录状态。",
        cancel: "取消",
        notLogin: "未登录"
    },
    pageMain:{
        title:"新对话",
        system: '系统',
        systemPlaceholder: '你是一个乐于助人的助手！',
        history: '历史记录',
        user: '用户',
        assistant: '助手',
        addMsg: '添加消息',
        clearList: '清空对话',
        submit: '发送',
        save: '保存',
        share: '分享',
        regenerate: '重新生成',
        msgPlaceHolder: '请填写内容',
        errorMsg: '发生了错误。可能是您请求的引擎不存在，或者在处理您的请求时出现了其他问题。如果此问题持续存在，请与我们联系。'
    },
    chatList: {
        newChat: "新建对话",
        noConversationHistory: "暂无对话记录",
        confirmDelete: "确认删除对话？",
        delete: "删除",
        historyTitle: "历史标题",
        settings: "设置",
        createChatFail: "新建对话失败 ",
        keepChat: "至少保留一个对话",
        deleteChatFail: "删除对话失败 ",
        modifyChatFail: "修改对话失败 ",
    },
    content: {
        more: '查看更多模型',
        sendMessage: "发送消息",
        share: "分享",
        cancel: "取消",
        selectAll: "选中全部",
        selectMessage: " 条消息已选中",
        stopGenerating: "停止生成",
        copySuccess: "复制成功",
        copyFail: "复制失败 ",
        regenerateResponse: "重新生成",
        chatError: "发生了错误。可能是您请求的引擎不存在，或者在处理您的请求时出现了其他问题。如果此问题持续存在，请通过我们的帮助中心help.O1ai.com与我们联系。",
        nameNotNull: "名字不能为空",
        lengthLimit: "英文最长24字符，中文最长12个字符",
        chooseOne: "请选择至少一条对话",
        contentTooLong: "您的内容太长了，不要超出2000字哦",
        shareCopySuccess: "分享链接已复制至剪切板。",
        copyLink: "复制链接",
        likeSuccess: "点赞成功",
        likeFail: "点赞失败",
        checkChatUpdate: "检测到会话更新",
        oprateFail: "操作失败 ",
        getUploadLinkFail: "获取上传链接失败",
        uploadFail: "上传失败",
        uploading: "文件上传中...",
        uploaded: "文件上传完毕"
    },
    prompt: {
        titleLeft: "欢迎体验",
        titleRight: "模型！",
        welcomeLeft: "你好，我是你的AI助手 ",
        welcomeRight: "！希望我能帮到你，你可以试着对我说：",
        welcomeDesc: `当前模型是快速微调的早期版本，诚邀您进行体验。您的反馈将助力我们即将推出的强化版模型`,
        promptOneTitle: "社媒文案",
        promptOneContent: `你是一位擅长创作爆款文案的的专家，请根据以下要求撰写一篇小红书的内容文案：
        文章主题：秋日驼色大衣推荐
        关键词：穿搭、气质、保暖
        创作要点： 标题运用二极管标题法吸引眼球，内容使用惊叹号、表情符号增加活力，运用悬念和刺激引发读者好奇心，融入热点话题，采用口语化表达，选择与标题和正文强相关的tags 
        字数要求： 约300字`,
        promptTwoTitle: "行业分析",
        promptTwoContent: "请作为一位专业咨询专家和分析师，为我详细介绍和分析光伏面板行业",
        promptThreeTitle: "概念解析",
        promptThreeContent: "请作为一名汉语言文学大学教授，使用通俗易懂的语言介绍“知之为知之”这一概念，注意请在解释中给出生活实例帮助我理解",
        promptFourTitle: "文学写作",
        promptFourContent: "请以“早上起来，我睁开眼睛”为开头续写一个科幻故事，要求故事线曲折，500字左右",
    },
    interface:{
        error:"接口错误",
        waitingDialogue:"对话进行中,请稍等片刻",
        uploadingPic:"图片上传中",
        reGenerate:"请重新生成错误的对话",
        detectedUpdate:"检测到会话更新",
        frequentOperation:"Your request is too frequent. Please retry after one minute.",
        serverIsUnstable:"服务器不稳定，请稍后",
        verifiCodeFail:"获取验证码失败",
        verifiCodeError:"获取验证码错误",
        uploadFailed:"上传失败",
        uploadLinkFailed:"获取上传链接失败"
    },
}

export default zh