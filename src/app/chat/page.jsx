'use client'

// import Link from 'next/link'
import React, { useEffect, useRef, useState, useMemo, useContext } from 'react'

import { copyTextToClipboard, sendEvents } from '@/util/yUtil'
import { store as localStore } from '@/util/store'
import Analytics from '@/util/awsReport'
import PlatformLayout from '@/app/platformLayout'
import PageMobile from '@/app/Mobile'
import { isVIP, XHost } from "@/api/util"

import { Button, message, Checkbox } from 'antd'
import { MessageList, statusEnum } from './components/message'
import { Spin } from 'antd'
import { CheckOutlined, CloseOutlined, PlusCircleOutlined , CloseCircleOutlined} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import {
  getConversationList,
  createConversation,
  getConversationDetail,
  deleteConversation,
  editConversation,
  createShare,
  chatUrl
} from '@/api/chat'

import ModelSelect from './components/modelSelect'
import ExamplePrompt from './components/examplePrompt'
import FileUpload from "@/components/file-upload/file"
import ImgUpload from "@/components/file-upload/imgMulti"
import QueryInput from "./components/queryInput"
import RegenerateBtn from "./components/regenerateBtn"
import './page.scss'

import { fetchEventSource } from '@microsoft/fetch-event-source'


import { UserContext } from '@/components/UserInfo/userInfoContext'

const MAX_CONVERSATION_COUNT = 30

function Index() {


  const [messageApi, contextHolder] = message.useMessage()
  const { t,i18n } = useTranslation()

  const [chating, setChating] = useState(false)
  const [messageList, setMessageList] = useState([])  // 当前对话包含的消息列表
  const [model, setModel] = useState('')  // 当前使用的模型

  const [isHistoryOpened, setIsHistoryOpened] = useState(true)
  const [currentEditConversation, setCurrentEditConversation] = useState(null)
  const [newConversationName, setNewConversationName] = useState('')
  const [conversationList, setConversationList] = useState([])  // 左侧的对话列表
  const [activeConversationId, setActiveConversationId] = useState(null) // 当前被激活的对话 conversationId[]
  const [activeConversation, setActiveConversation] = useState(null)
  const [creating, setCreating] = useState(false)
  const [checkedLength, setCheckedLength] = useState(2)

  // 输入框相关
  const uploadRef = useRef()
  const inputRef = useRef()


  // 以下为对话相关 state
  const [uploadFile, setUploadFile]= useState(null) // 输入框的图片
  const [uploading, setUploading]= useState(false) 
  const [readyToShare,setReadyToShare] = useState(false) //
  const [conversationLoading,setConverSationLoading ]= useState(false) // 对话列表加载中
  const [full,setFull]= useState(false)
  const [checkAll,setCheckAll]= useState(false)
  const userScrolling = useRef()

  const conversationNameInput = useRef()
  const conversationListRef = useRef()
  const messageListComponentRef = useRef()

  const prevActiveConversationIdRef = useRef('')

  // 用户信息
  const userContext = useContext(UserContext)

  // console.log('render', userContext)

  const buzy = useMemo(() => {
    if(chating || creating || uploading){
      return true
    } else {
      return false
    }
  }, [chating, creating, uploading]) 

  const imgUploadShow = useMemo(() => {
    return model.toLowerCase().startsWith("yi-34b-vl") || model.toLowerCase().startsWith("yi-6b-vl") || model === ("llava_image_chat") || model.toLowerCase().startsWith("yi-vl")
  }, [model])

  const fileUploadShow = useMemo(() => {
    return model.toLowerCase().includes("200k")
  }, [model])

  const uploadKey = useMemo(() => {
    return fileUploadShow ? 'docFilePath' : 'imageList'
  }, [fileUploadShow])

  useEffect(() => {
    Analytics.record({
      name: 'chatShow'
    })
    queryGetConversationList()
    setModel(localStore.get('last-select-model') || '')
  }, [])

  useEffect(() => {
    if (currentEditConversation) {
      setNewConversationName(currentEditConversation.title)
    } else {
      setNewConversationName("")
    }
  }, [currentEditConversation])

  useEffect(() => {
    if (conversationList.length && activeConversationId) {
      const tmp = conversationList.find(item => item.conversationId === activeConversationId)
      // console.log('tmp', tmp)
      setActiveConversation(tmp)
      if(prevActiveConversationIdRef.current === activeConversationId){
        // console.log('same')
      } else {
        prevActiveConversationIdRef.current = activeConversationId
        setMessageList([])
        clear()
        setCheckedLength(2)
        setReadyToShare(false)
        handleGetConversationDetail(activeConversationId)
        
      }
      
    }
  }, [conversationList, activeConversationId])
  

  const clear = () => {
    inputRef.current?.clear()
    uploadRef.current?.clear()
  }

  const queryGetConversationList = async () => {
    const res = await getConversationList()
    const queryList = res?.data?.list || []
    setConversationList(queryList)

    if ((!queryList.length) && queryList.length < MAX_CONVERSATION_COUNT) {
      await handleCreateConversation()
    }

    setActiveConversationId(queryList?.[0]?.conversationId)
  }

  const deleteConversationLast = async () => {
    try {
      const lastOneConversationId = conversationList.at(-1).conversationId
      await deleteConversation(lastOneConversationId)
      
      conversationList.pop()
      setConversationList(conversationList)
    } catch (e) {
      messageApi.open({
        type: 'error',
        content: t("chatList.deleteChatFail") + e.message || '',
      })
    }
  }
  const handleDeleteConversation = async (item) => {
    if (chating) return messageApi.loading()
    if (conversationList.length === 1) return messageApi.open({
      type: 'error',
      content: t("chatList.keepChat"),
      duration: 3
    })
    try {
      await deleteConversation(item.conversationId)
      if (item.conversationId === activeConversationId) {
        // 删除选中，需要自动选中 index0
        if (conversationList[0].conversationId === activeConversationId ) {
          // 第一行选中，且删除第一行 ，无index0, 应选中 index1
          setActiveConversationId(conversationList[1].conversationId)
        }else{
          setActiveConversationId(conversationList[0].conversationId)
        }
        // 列表滚动到顶部
        setTimeout(() => {
          conversationListRef.current.scrollTop = 0
        }, 100)
        
      }

      const tempList = conversationList.map(el=>{
        if (item.conversationId !== el.conversationId) {
          return el
        }
      }).filter(Boolean)
      
      setConversationList(tempList)
    } catch (e) {
      messageApi.open({
        type: 'error',
        content: t("chatList.deleteChatFail") + e.message || '',
      })
    }
  }

  const handleCreateConversation = async () => {
    if (creating || chating) return messageApi.loading()

    const projectLanguageLast = localStore.get('projectLanguageLast')

    try {
      setCreating(true)
      const res = await createConversation({ model, language: projectLanguageLast })
      setCreating(false)

      if(res.data){
        conversationList.unshift(res.data)
        setConversationList(conversationList)
        setConversationList([...conversationList])
        setActiveConversationId(res.data.conversationId)
      }

      

      // 列表滚动到顶部
      conversationListRef.current.scrollTop = 0
    } catch (e) {
      setCreating(false)
      messageApi.open({
        type: 'error',
        content: t("chatList.createChatFail") + e.message || '',
      })
    }
  }
  const handleGetConversationDetail = async(conversationId)=>{
    setConverSationLoading(true)

    const res = await getConversationDetail(conversationId)
    if (res.data?.conversationId !== activeConversationId) return
    const msglist =  res.data?.messageList || []
    setMessageList(msglist)
    setModel(res.data?.model)

    const lastModel = localStore.get('last-select-model')
    if (msglist.length === 0  && lastModel && res.data.model !== lastModel) {
      editConversation(res.data.conversationId, res.data.title, lastModel).then(res => {
        // console.log('lastModel', lastModel)
        setModel(lastModel)
        // 根据左侧会话列表选中的会话，实时触发右侧会话区的语言切换，即布局切换
        changeModelLayout(res.data.model)
      })
    }

    // 根据左侧会话列表选中的会话，实时触发右侧会话区的语言切换，即布局切换
    changeModelLayout(res.data?.model)
    setConverSationLoading(false)
    scrollToEnd()
  }

  const shareClick = async()=>{
    if(buzy) return messageApi.loading()
    const res = await getConversationDetail(activeConversationId)
    if (res.data?.conversationId !== activeConversationId) return
    const msglist =  res.data?.messageList || []
    setMessageList(msglist)
    setReadyToShare(true)
  }

  const handleEditConversation =  async (item)=> {

    if (newConversationName === '') {
      return messageApi.open({
        type: 'warning',
        content: t('content.nameNotNull'),
      })
    }
    if (truncate(newConversationName)[1] > 24){
      return messageApi.open({
        type: 'warning',
        content: t('content.lengthLimit'),
      })
    }

    if (item.title === newConversationName) return setCurrentEditConversation(null)
    try {
      const res = await editConversation(item.conversationId, newConversationName, model)
      if (res.status === 0) {
        item.title = newConversationName
      }
      setCurrentEditConversation(null)
    } catch (e) {
      return messageApi.open({
        type: 'error',
        content: e.message || <CloseCircleOutlined/>
      })
    }
  }

  const changeModelLayout = (model = '') =>{
    // 当前国际化语言
    // const i18n = this.$i18n.locale;
    const localLanguage = i18n.language

    // 当阿语模型时设置布局
    if (model.endsWith('Arabic') || model === 'arabic') {
      // this.$store.commit("setModelLayoutLanguage", 'rtl')
      localStore.set('modelLayoutLanguage', 'rtl')
      // 选中阿语模型，且国际化不是阿语时，设置为对应阿语国际化
      if(localLanguage === 'zh'){
        i18n.changeLanguage('zhAr')
        // this.$i18n.locale = 'zhAr'
      }
      if(localLanguage === 'en'){
          i18n.changeLanguage('enAr')
          // this.$i18n.locale = 'enAr'
      }
    } else {
      if(localLanguage === 'zhAr'){
        i18n.changeLanguage('zh')
      }
      if(localLanguage === 'enAr'){
          i18n.changeLanguage('en')
      }
      // this.$store.commit("setModelLayoutLanguage", 'ltr')
      localStore.set('modelLayoutLanguage', 'ltr')
    }

    // 当国际化选中英文且模型是特定模型时，切换为英文国际化文案
    if(localLanguage === 'en' && model.includes('_companion_')){
      i18n.changeLanguage('en2')
      // this.$store.commit("setProjectLanguage", 'en2')
      localStore.set('projectLanguageLast', 'en2')
    }
    if(localLanguage === 'en2' && !model.includes('_companion_')){
      i18n.changeLanguage('en')
      // this.$store.commit("setProjectLanguage", 'en')
      localStore.set('projectLanguageLast', 'en')
    }
  }

  const scrollToEnd = () => {
    requestAnimationFrame(() => {
      if(userScrolling.current) return
      messageListComponentRef.current?.scrollEnd()
    })
  }
  const truncate = (str) =>{
    let count = 0
    let result = ''
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i)
      if (charCode >= 0 && charCode <= 255) {
        count += 1
      } else {
        count += 2
      }

      if (count > 24) {
        //
      } else {
        result += str[i]
      }
    }
    return [result, count]
  }

  const copyLink = () => {
    handleCreateShare(activeConversationId)
  }

  const handleCreateShare = async  (conversationId) =>{
    const messageIds = messageListComponentRef.current?.getCheckList() ||[]

    // console.log('messageIds', messageIds)
    if (messageIds.length <= 0) return messageApi.open({
      type: 'warning',
      content: t('content.chooseOne'),
    })
    try {
      
      const res = await createShare(conversationId, messageIds)
      if (res.status === 0) {
        const shareUrl = window.location.protocol + '//' + window.location.host + '/share?shareId=' + res.data.shareKey
        copyTextToClipboard(shareUrl).then(() => messageApi.open({
          type: 'success',
          content: t('content.copySuccess'),
        })
        )
        setCheckedLength(2)
        setReadyToShare(false)
      }
    } catch (e) {
      messageApi.open({
        type: 'error',
        content: t('content.copyFail') + e.message || '',
      })
    }
  }

  const sendChat = async (regenerate) => {

    if(buzy) {
      return messageApi.loading()
    }
    userScrolling.current = false
    const inputText = inputRef.current.getQuery()
    
    const lastOne = messageList[messageList.length - 1]
    
    // 自动改名
    if (messageList.length === 0) {
      const newName = truncate(inputText)[0]
      setNewConversationName(newName)
      editConversation(activeConversation.conversationId, newName, model).then(res => {
        setConversationList(conversationList.map(v => {
          if(v.conversationId === activeConversation.conversationId){
            return {
              ...v,
              title: newName
            }
          } else {
            return v
          }
        }))
      })
    }
    let content = inputText
    let fullPath = uploadFile

    if(fileUploadShow && content === ''){
      content = '整理该文件的核心内容'
    }

    if (regenerate) {
      messageList.pop()
      const lastUser = messageList[messageList.length - 1]
      content = lastUser.content
      fullPath = lastUser[uploadKey]
      
      if (lastOne.status === statusEnum.error) {
        //
      } else {
        messageListComponentRef.current.postVote({ v: lastOne, vote: -1 }, false)
      }

    } else {
      if (inputText === '' && uploadFile === null) return
      if (inputText.length > 2000) return messageApi.error(t('content.contentTooLong'))
      const userMsg = {
        content,
        role: 'user',
        [uploadKey]: fullPath,
      }
      messageList.push(userMsg)
    }

    
    scrollToEnd()
    const textObj = {
      status: statusEnum.loading,
      role: 'assistant',
      content: ''
    }
    messageList.push(textObj)
    clear()
    setMessageList(messageList)

    setChating(true)
    
    await streamChat({
      content, 
      regenerate, 
      textObj, 
      fullPath,
      parent_message_id: lastOne?.messageId,
      curList: messageList
    })
  }

  const streamChat = ({
    content, 
    regenerate, 
    textObj, 
    fullPath,
    parent_message_id,
    curList
  }) => { // 文字流式请求

    let firstTime = true
    let isEnd = false
    
    return fetchEventSource(chatUrl, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStore.get('user-token'),
        'X-Host': XHost
      },
      body: JSON.stringify({
        content,
        conversationId: activeConversationId,
        regenerate: +Boolean(regenerate),
        [uploadKey]: fullPath,
        parent_message_id,
        model: model
      }),
      openWhenHidden: true,
      async onopen(response) {
        if (response.ok) {
          textObj.status = statusEnum.streaming
          textObj.messageId = response.headers.get('assistant-message-id')
          console.log('messageId', textObj.messageId)

        } else if (response.status >= 400) {
          if(response.status === 409){
            messageApi.open({
              type: 'warning',
              content: t("content.checkChatUpdate")
            })
            queryGetConversationList()
            handleGetConversationDetail(activeConversationId)
          } else if(response.status === 429){
            textObj.errorMsg = 'Your request is too frequent. Please retry after one minute.'
          }
          throw new Error(`response.status error ${response.status}`)
        }
      },
      onmessage(msg) {
        // if the server emits an error message, throw an exception
        // so it gets handled by the onerror callback below:

        // console.log('allData', msg.data)
        if (msg.event === 'FatalError') throw new Error(msg.data)
        const data = JSON.parse(msg.data)
        textObj.content = data.content
        scrollToEnd()

        if(firstTime){
          firstTime = false
          curList.pop()
        }

        setMessageList(curList.concat(textObj))

        if (data.lastOne) {
          isEnd = true
          textObj.status = statusEnum.done
          return
        }
      },
      onclose(e) {
        // if the server closes the connection unexpectedly, retry:
        // throw new Error()
        // console.log('close', e)
        setChating(() => {
          scrollToEnd()
          return false
        })
        
        if (isEnd) {
          //
        } else {
          throw new Error('close unexpectedly')
        }
      },
      onerror(err) {
        // console.log('close2', err)
        textObj.status = statusEnum.error
        setChating(false)
        scrollToEnd()
        let str = ''
        if (err.toString) {
          str = err.toString()
        }
        sendEvents('pgStreamError')
        Analytics.record({
          name: 'pgStreamError',
          attributes: {
            error: str
          }
        })
        throw err
      }
    })
  }

  // 当语言不是阿语，模型是阿语时，设置为rtl
  const projectLanguageLast = localStore.get('projectLanguageLast')
  const modelLayoutLanguage = localStore.get('modelLayoutLanguage')

  let messageMainLayout = projectLanguageLast !== "ar" && modelLayoutLanguage === "rtl" ? "rtl" : ""
  if (projectLanguageLast === "ar") {
    messageMainLayout = 'rtl'
  }

  return (
    <div className="chat-container">
      {contextHolder}
      <div className="global-box overflow-hidden w-full h-full relative">
        <div className="flex flex-row main-container" style={{ height: "calc(100%)", backgroundColor: "#F1F1F1" }}>
          {/* 对话列表区 */}
          <div className="flex flex-col gap-3 py-4 rounded bg-white aside-list" hidden={!isHistoryOpened}>
            <div className="flex flex-row px-4 items-center justify-between">
              <a
                className="flex flex-row items-center gap-2.5 px-5 py-2.5 text-sm font-semibold text-green-800 hover:text-white border border-green-800 hover:border-transparent rounded cursor-pointer history-new-chat"
                style={{ fontSize: "15px" }}
                onClick={() => {
                  if (conversationList.length >= MAX_CONVERSATION_COUNT) {
                    deleteConversationLast()
                    handleCreateConversation()
                  } else {
                    handleCreateConversation()
                  }
                }}
              >
                <svg className="hover:text-white-90" width="14" height="14" viewBox="0 0 14 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M2 0C0.895431 0 0 0.89543 0 2V12C0 13.1046 0.89543 14 2 14H12C13.1046 14 14 13.1046 14 12V2C14 0.895431 13.1046 0 12 0H2ZM7 3.5H6.35229V6.35229H3.5V7V7.64771H6.35229V10.5H7H7.64771V7.64771H10.5V7V6.35229H7.64771V3.5H7Z" fill="currentColor" />
                </svg>
                {t('chatList.newChat') /**新建对话 */}
              </a>
              <a
                className="flex items-center cursor-pointer items-icon text-gray-100"
                onClick={() => {
                  setIsHistoryOpened(!isHistoryOpened)
                  if (!isHistoryOpened) {
                    document.body.className = document.body.className + ' history-closed'
                  } else {
                    document.body.className = document.body.className.replace(' history-closed', '')
                  }
                }}
              >
                <svg className="text-gray-04 hover:text-gray-12" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="32" height="32" rx="4" fill="currentColor" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M9.92502 8.4624C9.11731 8.4624 8.46252 9.11719 8.46252 9.9249V22.0749C8.46252 22.8826 9.11731 23.5374 9.92502 23.5374H22.075C22.8827 23.5374 23.5375 22.8826 23.5375 22.0749V9.9249C23.5375 9.11719 22.8827 8.4624 22.075 8.4624H9.92502ZM10.0375 21.9624V10.0374H12.625V21.9624H10.0375ZM14.0875 21.9624H21.9625V10.0374H14.0875V21.9624Z" fill="black" fillOpacity="0.88" />
                </svg>
                {/* 折叠列表 */}
              </a>
            </div>
            <div className="flex flex-col px-4 gap-0.5 text-black text-sm overflow-y-scroll" ref={conversationListRef}>
              {conversationList.map((item, index) => {
                // console.log('conversationList', conversationList)
                return <div className="flex flex-row items-center justify-between py-3 px-3 rounded cursor-pointer history-chat-tab"
                  key={item.conversationId}
                  data-active={item.conversationId === activeConversationId}
                  
                  onClick={() => {
                    if (chating) return messageApi.loading()
                    setActiveConversationId(item.conversationId)
                  }}
                >
                  {/* 列表行按钮 */}
                  <a
                    className="flex items-center gap-3 min-w-0"
                    data-id={item.conversationId}
                  >
                    <svg className="flex-shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_367_1466)">
                        <path opacity="0.65" d="M3.16569 9.5C3.0596 9.5 2.95786 9.54214 2.88284 9.61716L0.682843 11.8172C0.430857 12.0691 0 11.8907 0 11.5343V1C0 0.447715 0.447715 0 1 0H11.5C12.0523 0 12.5 0.447715 12.5 1V8.5C12.5 9.05228 12.0523 9.5 11.5 9.5H3.16569ZM5 3.9C5 3.67909 4.82091 3.5 4.6 3.5H3.4C3.17909 3.5 3 3.67909 3 3.9V5.6C3 5.82091 3.17909 6 3.4 6H4.6C4.82091 6 5 5.82091 5 5.6V3.9ZM9.5 3.9C9.5 3.67909 9.32091 3.5 9.1 3.5H7.9C7.67909 3.5 7.5 3.67909 7.5 3.9V5.6C7.5 5.82091 7.67909 6 7.9 6H9.1C9.32091 6 9.5 5.82091 9.5 5.6V3.9Z" fill="url(#paint0_linear_367_1466)" />
                        <path opacity="0.3" d="M13.6 11C13.8209 11 14 10.8209 14 10.6V4.6C14 4.26863 14.2686 4 14.6 4H15.4C15.7314 4 16 4.26863 16 4.6V15.0585C16 15.4114 15.5763 15.5914 15.3223 15.3464L13.0057 13.1121C12.9312 13.0402 12.8316 13 12.728 13H5.1C4.76863 13 4.5 12.7314 4.5 12.4V11.6C4.5 11.2686 4.76863 11 5.1 11H13.6Z" fill="url(#paint1_linear_367_1466)" />
                      </g>
                      <defs>
                        <linearGradient id="paint0_linear_367_1466" x1="3.63799e-06" y1="12.5" x2="13.3848" y2="11.4673" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#165A4B" />
                          <stop offset="1" stopColor="#147B64" />
                        </linearGradient>
                        <linearGradient id="paint1_linear_367_1466" x1="4.5" y1="16" x2="16.82" y2="15.089" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#165A4B" />
                          <stop offset="1" stopColor="#147B64" />
                        </linearGradient>
                        <clipPath id="clip0_367_1466">
                          <rect width="16" height="16" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                    <span
                      title={item.title}
                      className="inline-block truncate text-ellipsis">
                      {item !== currentEditConversation
                        ? item.title
                        : <input
                          ref={conversationNameInput}
                          value={newConversationName}
                          onChange={(e)=>{
                            const val = e.target.value
                            setNewConversationName(val)
                          }}
                          maxLength="20"
                          style={{ color: "#000", padding: "0 6px", width: "150px", outline: "0 none" }}
                          onKeyUp={e => {
                            if (e.which === 13 || e.keyCode === 13) {
                              handleEditConversation(item)
                            }
                          }}
                        />
                      }
                    </span>
                  </a>
                  <a className="flex items-center gap-1 conversation-opt">
                    {item !== currentEditConversation
                      ? <button className="w-5 hover:text-green-800 items-edit-icon" onClick={e => {
                        e.stopPropagation()
                        setCurrentEditConversation(item)
                        setNewConversationName(item.title) // 利用临时变量
                        setTimeout(() => {
                          conversationNameInput.current.focus()
                        })
                      }}><svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd" d="M12.2278 3.4802C12.4806 3.2274 12.8905 3.2274 13.1433 3.4802L16.0423 6.37919C16.2951 6.63199 16.2951 7.04186 16.0423 7.29466L7.37766 15.9593C7.3372 15.9997 7.28231 16.0225 7.22509 16.0225H3.71578C3.59661 16.0225 3.5 15.9259 3.5 15.8067V12.2974C3.5 12.2401 3.52273 12.1853 3.5632 12.1448L12.2278 3.4802ZM12.8381 4.70082C12.7538 4.61656 12.6172 4.61656 12.533 4.70082L11.4077 5.82609L13.6964 8.11477L14.8216 6.9895C14.9059 6.90524 14.9059 6.76861 14.8216 6.68435L12.8381 4.70082ZM12.9335 8.87767L10.6448 6.58898L4.57889 12.6549V14.7278C4.57889 14.847 4.6755 14.9436 4.79467 14.9436H6.86757L12.9335 8.87767Z" fill="currentColor" />
                          <path d="M13.1786 3.44484C12.9063 3.17251 12.4648 3.17252 12.1924 3.44484L3.52784 12.1094C3.478 12.1593 3.45 12.2269 3.45 12.2974V15.8067C3.45 15.9535 3.56899 16.0725 3.71578 16.0725H7.22509C7.29558 16.0725 7.36318 16.0445 7.41302 15.9946L16.0776 7.33002C16.3499 7.05769 16.3499 6.61616 16.0776 6.34383L13.1786 3.44484ZM12.5683 4.73618C12.6331 4.67144 12.738 4.67144 12.8028 4.73618L14.7863 6.7197C14.851 6.78444 14.851 6.88941 14.7863 6.95415L13.6964 8.04406L11.4784 5.82609L12.5683 4.73618ZM10.6448 6.65969L12.8628 8.87767L6.84686 14.8936H4.79467C4.70312 14.8936 4.62889 14.8193 4.62889 14.7278V12.6757L10.6448 6.65969Z" stroke="black" strokeOpacity="0.88" strokeWidth="0.1" />
                        </svg>
                      </button>
                      : <button className="w-5 hover:text-green-800" onClick={e => {
                        e.stopPropagation()
                        handleEditConversation(item)
                      }}><CheckOutlined /></button>
                    }
                    {item !== currentEditConversation
                      ? <button className="w-5 hover:text-green-800" onClick={e => {
                        e.stopPropagation()
                        handleDeleteConversation(item)
                      }}><svg width="20" height="20"  viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <mask id="path-2-outside-1_367_1484" maskUnits="userSpaceOnUse" x="2" y="2.5" width="16" height="15" fill="currentColor">
                            <rect fill="white" x="2" y="2.5" width="16" height="15" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M13.9667 3.5C14.0771 3.5 14.1667 3.58954 14.1667 3.7V6.16667H16.8C16.9105 6.16667 17 6.25621 17 6.36667V6.96667C17 7.07712 16.9105 7.16667 16.8 7.16667H15.5V15.5C15.5 16.0523 15.0523 16.5 14.5 16.5H5.5C4.94772 16.5 4.5 16.0523 4.5 15.5V7.16667H3.2C3.08954 7.16667 3 7.07712 3 6.96667V6.36667C3 6.25621 3.08954 6.16667 3.2 6.16667H5.83333V3.7C5.83333 3.58954 5.92288 3.5 6.03333 3.5H13.9667ZM13.1667 4.5V6.16667H6.83333V4.5H13.1667ZM5.5 7.36667C5.5 7.25621 5.58954 7.16667 5.7 7.16667H14.3C14.4105 7.16667 14.5 7.25621 14.5 7.36667V15.3C14.5 15.4105 14.4105 15.5 14.3 15.5H5.7C5.58954 15.5 5.5 15.4105 5.5 15.3V7.36667ZM11.9999 12.5785L10.75 11.3285L11.9999 10.0784L11.25 9.32848L9.99996 10.5784L8.74993 9.32848L7.99995 10.0784L9.24993 11.3285L7.99995 12.5784L8.74993 13.3285L9.99996 12.0784L11.25 13.3285L11.9999 12.5785Z" />
                          </mask>
                          <path fillRule="evenodd" clipRule="evenodd" d="M13.9667 3.5C14.0771 3.5 14.1667 3.58954 14.1667 3.7V6.16667H16.8C16.9105 6.16667 17 6.25621 17 6.36667V6.96667C17 7.07712 16.9105 7.16667 16.8 7.16667H15.5V15.5C15.5 16.0523 15.0523 16.5 14.5 16.5H5.5C4.94772 16.5 4.5 16.0523 4.5 15.5V7.16667H3.2C3.08954 7.16667 3 7.07712 3 6.96667V6.36667C3 6.25621 3.08954 6.16667 3.2 6.16667H5.83333V3.7C5.83333 3.58954 5.92288 3.5 6.03333 3.5H13.9667ZM13.1667 4.5V6.16667H6.83333V4.5H13.1667ZM5.5 7.36667C5.5 7.25621 5.58954 7.16667 5.7 7.16667H14.3C14.4105 7.16667 14.5 7.25621 14.5 7.36667V15.3C14.5 15.4105 14.4105 15.5 14.3 15.5H5.7C5.58954 15.5 5.5 15.4105 5.5 15.3V7.36667ZM11.9999 12.5785L10.75 11.3285L11.9999 10.0784L11.25 9.32848L9.99996 10.5784L8.74993 9.32848L7.99995 10.0784L9.24993 11.3285L7.99995 12.5784L8.74993 13.3285L9.99996 12.0784L11.25 13.3285L11.9999 12.5785Z" fill="currentColor" />
                          <path d="M14.1667 6.16667H14.0667V6.26667H14.1667V6.16667ZM15.5 7.16667V7.06667H15.4V7.16667H15.5ZM4.5 7.16667H4.6V7.06667H4.5V7.16667ZM5.83333 6.16667V6.26667H5.93333V6.16667H5.83333ZM13.1667 6.16667V6.26667H13.2667V6.16667H13.1667ZM13.1667 4.5H13.2667V4.4H13.1667V4.5ZM6.83333 6.16667H6.73333V6.26667H6.83333V6.16667ZM6.83333 4.5V4.4H6.73333V4.5H6.83333ZM10.75 11.3285L10.6793 11.2578L10.6086 11.3285L10.6793 11.3992L10.75 11.3285ZM11.9999 12.5785L12.0707 12.6492L12.1414 12.5785L12.0707 12.5078L11.9999 12.5785ZM11.9999 10.0784L12.0707 10.1492L12.1414 10.0784L12.0707 10.0077L11.9999 10.0784ZM11.25 9.32848L11.3207 9.25777L11.25 9.18706L11.1793 9.25777L11.25 9.32848ZM9.99996 10.5784L9.92925 10.6492L9.99996 10.7199L10.0707 10.6492L9.99996 10.5784ZM8.74993 9.32848L8.82064 9.25777L8.74993 9.18706L8.67922 9.25777L8.74993 9.32848ZM7.99995 10.0784L7.92924 10.0077L7.85853 10.0784L7.92923 10.1492L7.99995 10.0784ZM9.24993 11.3285L9.32064 11.3992L9.39135 11.3285L9.32064 11.2578L9.24993 11.3285ZM7.99995 12.5784L7.92924 12.5077L7.85854 12.5784L7.92924 12.6491L7.99995 12.5784ZM8.74993 13.3285L8.67921 13.3992L8.74993 13.4699L8.82064 13.3992L8.74993 13.3285ZM9.99996 12.0784L10.0707 12.0077L9.99996 11.937L9.92925 12.0077L9.99996 12.0784ZM11.25 13.3285L11.1793 13.3992L11.25 13.4699L11.3207 13.3992L11.25 13.3285ZM14.2667 3.7C14.2667 3.53432 14.1324 3.4 13.9667 3.4V3.6C14.0219 3.6 14.0667 3.64477 14.0667 3.7H14.2667ZM14.2667 6.16667V3.7H14.0667V6.16667H14.2667ZM16.8 6.06667H14.1667V6.26667H16.8V6.06667ZM17.1 6.36667C17.1 6.20098 16.9657 6.06667 16.8 6.06667V6.26667C16.8552 6.26667 16.9 6.31144 16.9 6.36667H17.1ZM17.1 6.96667V6.36667H16.9V6.96667H17.1ZM16.8 7.26667C16.9657 7.26667 17.1 7.13235 17.1 6.96667H16.9C16.9 7.0219 16.8552 7.06667 16.8 7.06667V7.26667ZM15.5 7.26667H16.8V7.06667H15.5V7.26667ZM15.6 15.5V7.16667H15.4V15.5H15.6ZM14.5 16.6C15.1075 16.6 15.6 16.1075 15.6 15.5H15.4C15.4 15.9971 14.9971 16.4 14.5 16.4V16.6ZM5.5 16.6H14.5V16.4H5.5V16.6ZM4.4 15.5C4.4 16.1075 4.89249 16.6 5.5 16.6V16.4C5.00294 16.4 4.6 15.9971 4.6 15.5H4.4ZM4.4 7.16667V15.5H4.6V7.16667H4.4ZM3.2 7.26667H4.5V7.06667H3.2V7.26667ZM2.9 6.96667C2.9 7.13235 3.03431 7.26667 3.2 7.26667V7.06667C3.14477 7.06667 3.1 7.0219 3.1 6.96667H2.9ZM2.9 6.36667V6.96667H3.1V6.36667H2.9ZM3.2 6.06667C3.03431 6.06667 2.9 6.20098 2.9 6.36667H3.1C3.1 6.31144 3.14477 6.26667 3.2 6.26667V6.06667ZM5.83333 6.06667H3.2V6.26667H5.83333V6.06667ZM5.73333 3.7V6.16667H5.93333V3.7H5.73333ZM6.03333 3.4C5.86765 3.4 5.73333 3.53432 5.73333 3.7H5.93333C5.93333 3.64477 5.9781 3.6 6.03333 3.6V3.4ZM13.9667 3.4H6.03333V3.6H13.9667V3.4ZM13.2667 6.16667V4.5H13.0667V6.16667H13.2667ZM6.83333 6.26667H13.1667V6.06667H6.83333V6.26667ZM6.73333 4.5V6.16667H6.93333V4.5H6.73333ZM13.1667 4.4H6.83333V4.6H13.1667V4.4ZM5.7 7.06667C5.53431 7.06667 5.4 7.20098 5.4 7.36667H5.6C5.6 7.31144 5.64477 7.26667 5.7 7.26667V7.06667ZM14.3 7.06667H5.7V7.26667H14.3V7.06667ZM14.6 7.36667C14.6 7.20098 14.4657 7.06667 14.3 7.06667V7.26667C14.3552 7.26667 14.4 7.31144 14.4 7.36667H14.6ZM14.6 15.3V7.36667H14.4V15.3H14.6ZM14.3 15.6C14.4657 15.6 14.6 15.4657 14.6 15.3H14.4C14.4 15.3552 14.3552 15.4 14.3 15.4V15.6ZM5.7 15.6H14.3V15.4H5.7V15.6ZM5.4 15.3C5.4 15.4657 5.53431 15.6 5.7 15.6V15.4C5.64477 15.4 5.6 15.3552 5.6 15.3H5.4ZM5.4 7.36667V15.3H5.6V7.36667H5.4ZM10.6793 11.3992L11.9292 12.6492L12.0707 12.5078L10.8207 11.2578L10.6793 11.3992ZM11.9292 10.0077L10.6793 11.2578L10.8207 11.3992L12.0707 10.1492L11.9292 10.0077ZM11.1793 9.39919L11.9292 10.1492L12.0707 10.0077L11.3207 9.25777L11.1793 9.39919ZM10.0707 10.6492L11.3207 9.39919L11.1793 9.25777L9.92925 10.5077L10.0707 10.6492ZM8.67922 9.39919L9.92925 10.6492L10.0707 10.5077L8.82064 9.25777L8.67922 9.39919ZM8.07066 10.1492L8.82064 9.39919L8.67922 9.25777L7.92924 10.0077L8.07066 10.1492ZM9.32064 11.2578L8.07066 10.0077L7.92923 10.1492L9.17921 11.3992L9.32064 11.2578ZM8.07066 12.6491L9.32064 11.3992L9.17922 11.2578L7.92924 12.5077L8.07066 12.6491ZM8.82064 13.2578L8.07067 12.5077L7.92924 12.6491L8.67921 13.3992L8.82064 13.2578ZM9.92925 12.0077L8.67922 13.2578L8.82064 13.3992L10.0707 12.1491L9.92925 12.0077ZM11.3207 13.2578L10.0707 12.0077L9.92925 12.1491L11.1793 13.3992L11.3207 13.2578ZM11.9292 12.5078L11.1793 13.2578L11.3207 13.3992L12.0707 12.6492L11.9292 12.5078Z" fill="currentColor" mask="url(#path-2-outside-1_367_1484)" />
                        </svg>
                      </button>
                      : <button className="w-5 hover:text-green-800" onClick={e => {
                        e.stopPropagation()
                        setCurrentEditConversation(null)
                      }}><CloseOutlined /></button>
                    }
                  </a>
                </div>
              })}
            </div>
          </div>
          {/* 问答区 */}
          <main className="flex flex-1 flex-col bg-white rounded" dir={messageMainLayout}>
            {/* 模型选择 区域 */}
            <div className="flex flex-row py-3 px-5 items-center text-black text-sm">
              <div className="inline-flex flex-1 justify-center sm-flex-0">
                <a
                  className="flex items-center mr-auto cursor-pointer text-gray-100"
                  hidden={isHistoryOpened}
                  onClick={() => {
                    setIsHistoryOpened(!isHistoryOpened)

                    if (isHistoryOpened) {
                      document.body.className = document.body.className + ' history-closed'
                    } else {
                      document.body.className = document.body.className.replace(' history-closed', '')
                    }
                  }}
                >
                  <svg className="text-gray-04 hover:text-gray-12" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="32" height="32" rx="4" fill="currentColor" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M9.92502 8.4624C9.11731 8.4624 8.46252 9.11719 8.46252 9.9249V22.0749C8.46252 22.8826 9.11731 23.5374 9.92502 23.5374H22.075C22.8827 23.5374 23.5375 22.8826 23.5375 22.0749V9.9249C23.5375 9.11719 22.8827 8.4624 22.075 8.4624H9.92502ZM10.0375 21.9624V10.0374H12.625V21.9624H10.0375ZM14.0875 21.9624H21.9625V10.0374H14.0875V21.9624Z" fill="black" fillOpacity="0.88" />
                  </svg>
                </a>
              </div>
              <div className="flex-1 text-center" hidden={messageList.length === 0}>
                <h1 className="text-base font-semibold">{activeConversation?.title}</h1>
              </div>
              {/* 模型选择下拉列表 */}
              <div className="inline-flex flex-1 justify-center sm-flex-0">
                <div className="flex items-center ml-auto gap-3">
                  <ModelSelect
                    hidden={readyToShare}
                    val={model}
                    full={full}
                    disabled={messageList.length > 0 || conversationLoading}
                    onChange={(val) => {
                      setModel(val)
                      editConversation(activeConversation.conversationId, activeConversation.title, val).then(res => {
                        setModel(val)
                        changeModelLayout(val)
                      }).catch(e => {
                        if (e.response && e.response.status === 409) {
                          messageApi.open({
                            type: 'warning',
                            content: t('content.checkChatUpdate')
                          })
                          getConversationList()
                          handleGetConversationDetail(activeConversationId)
                        }
                      })
                    }}
                    ></ModelSelect>
                    {/* 更多按钮 */}
                    
                  {isVIP() ? <Button property="default" text={t('content.more')} type="white-30"
                    className="chat-default-button button-full"
                    hidden={full || messageList.length !== 0 || readyToShare}
                    onClick={() => {
                      setFull(true)
                    }} >{t('content.more')}</Button> : null}
                  {/* 分享按钮 */}
                  <div hidden={messageList.length === 0 || readyToShare}>
                    <Button property="default" text={t('content.share')} type="white-30"
                      className="chat-default-button button-full"
                      onClick={async () => {
                        await shareClick()
                      }}> {t('content.share')}</Button>
                  </div>

                </div>
              </div>
            </div>
            {/* 消息列表 */}
            <div className="flex mb-5 overflow-y-auto" onWheel={(e) => {
              const visible = messageListComponentRef.current?.checkEndVisible()
                if (visible) {
                  userScrolling.current = false
                } else {
                  userScrolling.current = true
                }
              }}>
                <div className="flex mx-auto content-width-wrapper">
                  <Spin className="conversation-loading-spin" hidden={!conversationLoading}></Spin>
                  <div className="main-content-wrapper w-full" hidden={conversationLoading || messageList.length === 0}>
                    <MessageList
                      ref={messageListComponentRef}
                      list={messageList}
                      setList={setMessageList}
                      setCheckedLength={setCheckedLength}
                      conversationId={activeConversationId}
                      isShare={false}
                      setCheckAll={setCheckAll}
                      shareClick={async () => { 
                        await shareClick() 
                      }}
                      readyToShare={readyToShare}
                      name={userContext.name}
                    >
                    </MessageList>
                  </div>
                  {/* 欢迎及ExamplePrompt 区域 */}
                  {messageList.length > 0 || conversationLoading ? null :
                    <ExamplePrompt
                      modelName={model}
                      onChoose={v => {
                        inputRef.current.setQuery(v.prompt)
                      }}
                    />
                  }
                </div>
              </div>
            <div className="main-content-bottom" hidden={readyToShare}>
              <div className="wrapper" hidden={buzy || messageList.length === 0}>
                <RegenerateBtn type="regenerate-response" clickFn={() => {
                  sendChat(true)
                }}></RegenerateBtn>
              </div>
              <div>
                <div className="flex">
                  <div className="w-full">
                    <div className="input-content-wrapper">
                      <div className="img-list">
                        {fileUploadShow ?<FileUpload 
                          accept="application/pdf"
                          ref={uploadRef} 
                          handleUploaded={(v) => {
                          // console.log('handleUploaded', v)
                          setUploadFile(v)
                          setUploading(false)
                        }} handleUploading={(v) => {
                          // console.log('handleUploading', v)
                          setUploading(true)
                        }}></FileUpload> : null}
                        {imgUploadShow ? <ImgUpload ref={uploadRef} handleUploaded={(v) => {
                          // console.log('handleUploaded', v)
                          setUploadFile(v)
                          setUploading(false)
                        }} handleUploading={(v) => {
                          // console.log('handleUploading', v)
                          setUploading(true)
                        }}></ImgUpload> : null }
                      </div>

                      <div className="flex flex-grow">
                        <div 
                          data-show={imgUploadShow || fileUploadShow}
                          className="upload-img-wrapper" 
                          onClick={() => {
                            uploadRef.current.showUpload()
                          }}
                        >
                          <PlusCircleOutlined></PlusCircleOutlined>
                        </div>
                        <QueryInput 
                        ref={inputRef} 
                        uploadFile={uploadFile}
                        pressEnter={() => {
                          sendChat()
                        }}></QueryInput>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* 分享 share */}
            <div className="bottom-share-show" hidden={!readyToShare}>
              {<div className="div">
                <Checkbox checked={checkAll} onChange={() => {
                  messageListComponentRef.current.toggleCheckAll()
                }}></Checkbox>
                <div className="div-2">
                  <div className="text-wrapper">{t('content.selectAll')}</div>
                  <div className="text-wrapper-2">{checkedLength}{t('content.selectMessage')}</div>
                </div>
              </div>}
              <div className="div-3">
                <Button text={t('content.cancel')} type="outline-36"
                  className="chat-default-button button-info"
                  onClick={() => {
                    setCheckedLength(2)
                    setReadyToShare(false)
                  }} >{t('content.cancel')}</Button>
                <Button text={t('content.share')} type="green-36"
                  className="chat-default-button button-primary"
                  onClick={() => {
                    copyLink()
                  }} >{t('content.share')}</Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}


const isUserMobile = () => {
  if(typeof navigator !== 'undefined') {
    const ua = navigator && navigator.userAgent.toLowerCase()
    // return /mobile|android|iphone|ipod|phone|ipad/i.test(ua)
    return /mobile|android|iphone|ipod|phone/i.test(ua)
  }
  return false
}


function PageChat() {
  return <PlatformLayout>
      <Index></Index>
  </PlatformLayout>
}


export default isUserMobile()? PageMobile:PageChat