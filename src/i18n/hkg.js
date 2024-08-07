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
        title: ' Chat模型體驗',
        pageError: "頁面錯誤！",
        page404: "404 錯誤頁面",
        backHome: "回到首页",
    },
    header: {
        chat: "聊天模式",
        playground: "開發模式",
        stableDiffusion: 'AI畫圖',
        logout: "登出",
        confirmLogout: "确认登出",
        logoutInfo: "當您登出時，將終止你瀏覽頁面的狀態。",
        cancel: "取消",
        notLogin: "未登入"
    },
    pageMain:{
        title:"新的對話",
        system: '系统',
        systemPlaceholder: '你是一位樂於助人的助理！',
        history: '歷史記錄',
        user: '用户',
        assistant: '助理',
        addMsg: '添加消息',
        clearList: '清空對話',
        submit: '提交',
        save: '保存',
        share: '分享',
        regenerate: '重新生成',
        msgPlaceHolder: '请填寫内容',
        errorMsg: '錯誤提示。可能是你提出要求的系統不存在, 或者在處理你的要求時出現了其他問題 。如果這問題繼續發生, 請與聯絡我們。'
    },
    chatList: {
        newChat: "開啟新的對話",
        noConversationHistory: "暫無對話記錄",
        confirmDelete: "確認刪去對話？",
        delete: "删除",
        historyTitle: "歷史標題",
        settings: "设置",
        createChatFail: "新建對話失敗 ",
        keepChat: "至少保留一個對話",
        deleteChatFail: "刪除對話失敗 ",
        modifyChatFail: "修改對話失敗 ",
    },
    content: {
        more: '查看更多模型',
        sendMessage: "發送消息",
        share: "分享",
        cancel: "取消",
        selectAll: "選擇全部",
        selectMessage: " 選中條消息",
        stopGenerating: "停止生成",
        copySuccess: "複製成功",
        copyFail: "複製失敗",
        regenerateResponse: "重新生成",
        chatError: "錯誤提示。可能是你提出要求的系統不存在, 或者在處理你的要求時出現了其他問題 。如果這問題繼續發生, 請通過我們的幫助中心help.O1ai.com 與我們聯絡。",
        nameNotNull: "名字不能是空白",
        lengthLimit: "英文最長24字母，中文最長12個字",
        chooseOne: "請選擇最少一條對話",
        contentTooLong: "你的内容太長, 不能超過2000個字呀",
        shareCopySuccess: "分享超連結已複製到剪貼板。",
        copyLink: "複製超連結",
        likeSuccess: "畀like 成功", 
        likeFail: "畀like 失敗",
        checkChatUpdate: "檢測到對話已更新",
        oprateFail: "操作失敗 ",
        getUploadLinkFail: "獲取上傳連結失敗",
        uploadFail: "上傳失敗",
        uploading: "文件上傳中...",
        uploaded: "文件上傳完成"
    },
    prompt: {
        titleLeft: "歡迎體驗",
        titleRight: "模型！",
        welcomeLeft: "你好，我是你的AI助理 ",
        welcomeRight: "！希望我能夠幫到你, 你可以試下同我講：",
        welcomeDesc: `目前模型是測試版本，誠意邀請你進行體驗。你的反饋將幫助我們推出更强化版模型`,
        promptOneTitle: "寫篇社交媒體貼文",
        promptOneContent: `如果你是擅長寫作爆款貼文的專家, 請根據一下要求編寫篇小紅書的内容貼文：
        文章主題:  秋天駝色大褸推介
       關鍵詞語: 配搭 氣質 保暖
       創作要點:  標題可運用二極管標題法去吸引關注, 内容使用感嘆號 表情符號增加活力, 運用懸念和刺激引起讀者好奇心, 融入熱點話題, 采用口語化文字表達, 選擇與標題和正文互相的tags, 字數要求, 約300個字
  `,
        promptTwoTitle: "行業分析",
        promptTwoContent: "請作爲以爲專業咨詢專家和分析師, 爲我詳細介紹和分析太陽能板及行業",
        promptThreeTitle: "概念解釋",
        promptThreeContent: "請作爲一位漢語語言文學大學教授, 使用通俗容易理解的語言, 介紹\"知之為知之\" 這一個概念，注意在解釋過程中, 請給一些生活案例幫助我理解",
        promptFourTitle: "文學寫作",
        promptFourContent: "請以“早上起來，我睜開眼睛” 作為開始, 繼續寫一個科幻故事, 要求故事綫曲折, 500個字左右",
    },
    interface:{
        error:"連接錯誤",
        waitingDialogue:"對話進行中, 請等一等",
        uploadingPic:"圖片上傳中",
        reGenerate:"請重新生成錯誤的對話",
        detectedUpdate:"檢測到對話已經更新呢",
        frequentOperation:"Your request is too frequent. Please retry after one minute.",
        serverIsUnstable:"伺服器不穩定, 請等一等",
        verifiCodeFail:"獲取驗證碼失敗",
        verifiCodeError:"獲取驗證碼錯誤",
        uploadFailed:"上傳失敗",
        uploadLinkFailed:"獲取上傳連結失敗"
    },
}

export default zh