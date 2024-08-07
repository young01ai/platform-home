/*
 * @Author: zuoyuxing001
 * @Date: 2023-11-13 19:38:25
 * @LastEditors: zuoyuxing001
 * @LastEditTime: 2023-11-20 11:11:40
 * @FilePath: /platform-assistant/src/i18n/ar.js
 * @Description: 
 */

const ar = {
    page:{
        title: ' Chatتجربة نموذج',
        pageError: "خطأ!",
        page404: "404 الصفحة غير موجودة",
        backHome: "الرجوع إلى الصفحة الرئيسية",
    },
    header: {
        chat: "الدردشة",
        playground: "التطوير",
        stableDiffusion: 'Stable Diffusion',
        logout: "تسجيل الخروج",
        confirmLogout: "تأكيد تسجيل الخروج",
        logoutInfo: "سيؤدي تسجيل الخروج إلى إنهاء حالة تسجيل الدخول الحالية في متصفحك.",
        cancel: "إلغاء",
        notLogin: "غير مسجل الدخول"
    },
    pageMain:{
        title:"دردشة جديدة",
        system: 'نظام',
        systemPlaceholder: 'أنت مساعد مفيد!',
        history: 'السجل التاريخي',
        user: 'مستخدم',
        assistant: 'مساعد',
        addMsg: 'اضافة رسالة',
        clearList: 'مسح المحادثات',
        submit: 'إرسال',
        save: 'حفظ',
        share: 'مشاركة',
        regenerate: 'تجديد الاستجابة',
        msgPlaceHolder: 'يرجى ملء المحتوى',
        errorMsg: 'حدث خطأ. من المحتمل أن المحرك الذي طلبته غير موجود، أو أن هناك مشكلة أخرى أثناء معالجة طلبك. إذا استمرت هذه المشكلة، يرجى الاتصال بنا.'
    },
    chatList: {
        newChat: "دردشة جديدة",
        noConversationHistory: "ليس لديك سجل محادثات حتى الآن.",
        confirmDelete: "حذف المحادثة؟",
        delete: "حذف",
        historyTitle: "عنوان تاريخي",
        settings: "إعدادات",
        createChatFail:"فشل في إنشاء محادثة جديدة",
        keepChat:"احتفظ بمحادثة واحدة على الأقل",
        deleteChatFail:"فشل حذف المحادثة",
        modifyChatFail:"فشل تعديل المحادثة",
    },
    content: {
        more: 'عرض المزيد',
        sendMessage: "إرسال رسالة",
        cancel: "إلغاء",
        share: "مشاركة",
        selectAll: "تحديد الكل",
        selectMessage: " تم تحديد رسائل متعددة",
        stopGenerating: "توقف عن التوليد",
        copySuccess: "تم النسخ",
        copyFail: " فشل النسخ",
        regenerateResponse: "إعادة توليد الاستجابة",
        chatError: "حدث خطأ. من المحتمل أن المحرك الذي طلبته غير موجود، أو أن هناك مشكلة أخرى أثناء معالجة طلبك. إذا استمرت هذه المشكلة، يرجى الاتصال بنا من خلال مركز المساعدة الخاص بنا على help.O1ai.com.",
        nameNotNull: " لا يمكن ترك الاسم فارغاً ",
        lengthLimit: "الحد الأقصى لطول اللغة الإنجليزية هو 24 حرفا، والحد الأقصى لطول اللغة الصينية هو 12 حرفا.",
        chooseOne: "يرجى تحديد محادثة واحدة على الأقل",
        contentTooLong: "المحتوى طويل جدا، يرجى عدم تجاوز 2000 كلمة.",
        shareCopySuccess: "تم نسخ الرابط المشارك إلى الحافظة.",
        copyLink: "نسخ الرابط",
        likeSuccess: "تم الإعجاب",
        likeFail: "فشل في الإعجاب",
        checkChatUpdate: "تم اكتشاف تحديث المحادثة",
        oprateFail: " فشلت العملية",
        getUploadLinkFail: "فشل الحصول على رابط التحميل",
        uploadFail: "فشل التحميل",
        uploading: "جاري تحميل الملف...",
        uploaded: "File uploaded"
    },
    prompt: {
        titleLeft: "مرحبا في تجربة نموذج ",
        titleRight: "！",
        welcomeLeft: "مرحبا! أنا مساعد الذكاء الاصطناعي ",
        welcomeRight: " ابدأ بأعطائي مهمة وسأتولى الباقي. هل تحتاج إلى بعض الإلهام؟ لا تتردد في تجربة التوجيهات أدناه.",
        welcomeDesc: `النموذج الحالي هو نموذج إصدار مبكر تم ضبطه تقريبًا، ونحن ندعوك بشدة لتجربته. ستكون ملاحظاتك لا تقدر بثمن بالنسبة لنموذجنا المحسن القادم`,
        promptOneTitle: "تفسير مفاهيم",
        promptOneContent: "ما هي رؤية السعودية 2030؟",
        promptTwoTitle: "تقديم نصائح",
        promptTwoContent: "أرغب البدء في تناول طعام صحي. هل يمكنك تقديم بعض النصائح أو الوصفات؟",
        promptThreeTitle: "تحليل الصناعة",
        promptThreeContent: "يرجى تحليل حالة التطوير الحالية للذكاء الاصطناعي.",
        promptFourTitle: "الاستعلام عن المعلومات",
        promptFourContent: "ما هي التقنيات الجديدة المستخدمة في كأس العالم في قطر؟"
    },
    interface:{
        error:"Interface error",
        waitingDialogue:"The conversation is in progress, please wait a moment",
        uploadingPic:"Image uploading",
        reGenerate:"Ops, please regenerate the conversation",
        detectedUpdate:"Detected session update",
        frequentOperation:"Your request is too frequent. Please retry after one minute.",
        serverIsUnstable:"Server is unstable, please try again later",
        verifiCodeFail:"Failed to retrieve verification code",
        verifiCodeError:"Error to retrieve verification code",
        uploadFailed:"Failed to upload image",
        uploadLinkFailed:"Failed to obtain upload link"
    },
}

export default ar