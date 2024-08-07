/*
 * @Author: zuoyuxing001
 * @Date: 2023-11-13 19:38:25
 * @LastEditors: zuoyuxing001
 * @LastEditTime: 2023-11-16 22:13:38
 * @FilePath: /platform-assistant/src/i18n/en.js
 * @Description: 
 */

const en = {
    page: {
        title: ' Chat Model',
        pageError: "An error occurred!",
        page404: "404 Page not found",
        backHome: "Back to home page",
    },
    header: {
        chat: "Chat",
        playground: "Playground",
        stableDiffusion: 'Stable Diffusion',
        logout: "Log out",
        confirmLogout: "Confirm logout",
        logoutInfo: "Logging out will terminate your current login status in your browser.",
        cancel: "Cancel",
        notLogin: "Sign in"
    },
    pageMain:{
        title:"New conversation",
        system: 'SYSTEM',
        systemPlaceholder: 'You are a helpful assistant!',
        history: 'History',
        user: 'USER',
        assistant: 'ASSISTANT',
        addMsg: 'Add message',
        clearList: 'Clear conversation',
        submit: 'Submit',
        save: 'Save',
        share: 'Share',
        regenerate: 'Regenerate',
        msgPlaceHolder: 'Enter message here.',
        errorMsg: 'An error occurred. Either the engine you requested does not exist or there was another issue processing your request. If this issue is still not resolved, please contact us.'
    },
    chatList: {
        newChat: "New Chat",
        noConversationHistory: "You have no conversation history yet.",
        confirmDelete: "Delete conversation?",
        delete: "Delete",
        historyTitle: "History title",
        settings: "Settings",
        createChatFail:"Failed to create new dialogue",
        keepChat:"Keep at least one dialogue",
        deleteChatFail:"Failed to delete dialogue",
        modifyChatFail:"Failed to modify dialogue",
    },
    content:{
        more: 'More models',
        sendMessage: "Send a message",
        cancel: "Cancel",
        share: "Share",
        selectAll: "Select all",
        selectMessage: " message selected",
        stopGenerating: "Stop generating",
        copySuccess: "Copy success",
        copyFail: "Copy failed ",
        regenerateResponse: "Regenerate response",
        chatError: "An error occurred. Either the engine you requested does not exist or there was another issueprocessing your request. If this issue persists please contact us through our help center at help.O1ai.com.",
        nameNotNull: "Name cannot be empty",
        lengthLimit: "English up to 24 characters, Chinese up to 12 characters",
        chooseOne: "Please select at least one dialogue",
        contentTooLong: "Your content is too long, do not exceed 2000 words",
        shareCopySuccess: "The shared link has been copied to the clipboard.",
        copyLink: "Copy link",
        likeSuccess: "Like succeeded",
        likeFail: "Like failed",
        checkChatUpdate: "Session update detected",
        oprateFail: "Operation failed ",
        getUploadLinkFail: "Failed to get upload link",
        uploadFail: "Upload failed",
        uploading: "File uploading...",
        uploaded: "File uploaded"
    },
    prompt: {
        titleLeft: "Welcome to ",
        titleRight: "！",
        welcomeLeft: "Hi! I'm your ",
        welcomeRight: " AI assistant. Start off by posting a task and I'll handle the rest. Need some inspiration? Feel free to try the prompts below.",
        welcomeDesc: `The current model is a roughly finetuned early version model, we sincerely invite you to try it out. Your feedback will be invaluable to our upcoming enhanced model`,
        promptOneTitle: "Get Health Tips",
        promptOneContent: "I want to start eating healthier. Can you provide some tips or recipes?",
        promptTwoTitle: "Make Travel Planning",
        promptTwoContent: "I'm planning a trip to Paris. Can you help me create an itinerary?",
        promptThreeTitle: "Learn New Skills",
        promptThreeContent: "I want to learn how to play the guitar. Can you recommend some beginner resources?",
        promptFourTitle: "Write Documents",
        promptFourContent: "I need to draft a document about the project progress. Can you help me outline the main points?",
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
export default en