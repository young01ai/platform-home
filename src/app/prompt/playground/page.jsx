'use client'

// import dynamic from "next/dynamic"
import './page.scss'
import { PlaygroundProvider } from './playgroundContext'
import { Input, ConfigProvider, Button, message } from 'antd'
import { MessageList } from './components/MessageList.jsx'
import HistoryDrawer from './components/HistoryDrawer.jsx'
import {
  ModelSelect,
} from './components/Select.jsx'
import { TemperatureSlider, MaxTokensSlider, TopPSlider, FrequencySlider, PresenceSlider } from './components/YSlider.jsx'
import { PlaygroundContext, PlaygroundDispatchContext } from './playgroundContext'
import { useContext, useRef, useState, useEffect } from 'react'
import { copyTextToClipboard } from '@/util/yUtil'
import { store } from '@/util/store'
import Analytics from '@/util/awsReport'
import { useTranslation } from 'react-i18next'

// const Markdown = dynamic(() => import("@/components/Markdown/Markdown"), {
//   // Do not import in server side
//   ssr: false,
// })

const { TextArea } = Input

const Main = () => {
  const playgroundContext = useContext(PlaygroundContext)
  const dispatch = useContext(PlaygroundDispatchContext)

  // console.log('playgroundContext', playgroundContext)

  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()

  const messageRef = useRef()

  function dispatchPrompt(e) {
    dispatch({
      type: 'change',
      key: 'prompt',
      value: e.target.value
    })
  }

  function saveConversation(messages) {
    console.log('playgroundContext', playgroundContext)
    const curHistoryConfig = {
      ...playgroundContext,
      title: t('pageMain.title'),
      messages,
      updateTime: new Date().getTime()
    }
    const historyConfig = store.get('history-config-01', true) || []
    historyConfig.unshift(curHistoryConfig)
    if(historyConfig.length > 100){
      historyConfig.pop()
    }
    store.set('history-config-01', historyConfig)
  }

  function sendChat(messages) {
    // saveConversation(messages)
    messageRef.current.streamChat(playgroundContext, messages, setLoading)
  }

  useEffect(() => {
    const historyConfig = store.get('history-config-01', true)
    if(historyConfig && historyConfig[0]){
      dispatch({ type: 'setPromptConfig', value: historyConfig[0] })
      messageRef.current.setMessages(historyConfig[0].messages)
    }

    Analytics.record({
      name: 'pgShow',
    })
  }, [])

  return (
    <div className="playground-content">
      {/* <h2 className="h2-title">Playground</h2> */}
      <div className="playground-header">
        <h2 className="playground-title">
          {/* <Input value={playgroundContext.title} onChange={(e, v) => {
            dispatch({
              type: 'change',
              key: 'title',
              value: e.target.value
            })
          }}></Input> */}
          {/* {playgroundContext.title}  */}
          {t('pageMain.title')}
        </h2>
        <div className="playground-header-right-op">
          <div style={{display: 'inline-block'}}>
            <ModelSelect></ModelSelect>
          </div>
          <Button loading={loading} className="main-prompt-button" onClick={() => {
              const messageList = messageRef.current.getMessages()
              saveConversation(messageList)
              message.success('😊')
          }}>{t('pageMain.save')}</Button>
          <Button loading={loading} className="main-prompt-button" onClick={() => {
              const messageList = messageRef.current.getMessages()
              copyTextToClipboard(JSON.stringify(messageList)).then(res => {
                // console.log(' !!!!')
                message.success('😊')
              })
          }}>{t('pageMain.share')}</Button>
        </div>
      </div>
      <div className="playground-main">
        <div className="system-prompt">
          <h3 className="h3-title">{t('pageMain.system')}</h3>

          <TextArea
            className="system-prompt-input"
            // onPressEnter={(e) => {
            //   dispatchPrompt(e)
            // }}
            onChange={(e) => {
              dispatchPrompt(e)
            }}
            placeholder={t('pageMain.systemPlaceholder')}
            value={playgroundContext.prompt}
            autoSize={false}/>
        </div>
        <div className="main-prompt">
          <MessageList ref={messageRef}></MessageList>
          <div className="main-prompt-bottom">
            <Button type="primary" loading={loading} className="main-prompt-button" onClick={() => {
              sendChat(messageRef.current.getMessages())
            }}>{t('pageMain.submit')}</Button>
            <Button loading={loading} className="main-prompt-button" onClick={() => {
              const messageList = messageRef.current.getMessages()
              const lastMessage = messageList[messageList.length - 1]
              if(lastMessage && lastMessage.role === 'assistant') messageList.pop()
              sendChat(messageList)
            }}>{t('pageMain.regenerate')}</Button>
            {/* <Button loading={loading} className="main-prompt-button" onClick={() => {
              const messageList = messageRef.current.getMessages()
              const str = JSON.stringify(messageList, null, 2)
              Modal.info({
                maskClosable: 'true',
                wrapClassName: 'show-md-modal',
                icon: null,
                content: <Markdown content={'``` json \n' + str + '\n ```'}></Markdown>,
                onOk() {
                  console.log('OK')
                  copyTextToClipboard(str).then(res => {
                    // console.log(' !!!!')
                    message.success('😊')
                  })
                },
                okButtonProps: {
                  type: 'default'
                },
                okText: '复制'
              })
            }}>显示对话内容</Button> */}
            <HistoryDrawer setMessage={(msg) => messageRef.current.setMessages(msg)}></HistoryDrawer>
          </div>
        </div>
        <div className="main-control">
          <h3 className="title-h3-mt title-h3">Temperature</h3>
          <TemperatureSlider></TemperatureSlider>
          <h3 className="title-h3-mt title-h3">Maximum length</h3>
          <MaxTokensSlider></MaxTokensSlider>
          <h3 className="title-h3-mt title-h3">Top P</h3>
          <TopPSlider></TopPSlider>
          <h3 className="title-h3-mt title-h3">Frequency penalty</h3>
          <FrequencySlider></FrequencySlider>
          <h3 className="title-h3-mt title-h3">Presence penalty</h3>
          <PresenceSlider></PresenceSlider>
        </div>
      </div>
    </div>
  )
}

const App = () => {
  return (
    <div className="playground">
      <ConfigProvider>
        <PlaygroundProvider>
          <Main></Main>
        </PlaygroundProvider>
      </ConfigProvider>
    </div>
  )
}
export default App