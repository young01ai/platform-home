

import './MessageList.scss'

import { fetchEventSource } from '@microsoft/fetch-event-source'

import { Input, notification } from 'antd'
import Icon, { MinusCircleOutlined } from '@ant-design/icons'
import TrashSvg from '@/components/IconY/trash.svg'
import PlusSvg from '@/components/IconY/plus-Circle.svg'

import { sendEvents } from '@/util/yUtil'
import Analytics from '@/util/awsReport'

import React, {
    useState,
    forwardRef,
    useImperativeHandle
} from 'react'

import { chatCompletions } from "@/api/playground"
import { XHost } from "@/api/util"
import { getToken } from "@/api/login"


import { useTranslation } from 'react-i18next'

const { TextArea } = Input

const MessageListFn = (props, ref) => {

    const { t } = useTranslation()
    // console.log('render')
    const [list, setList] = useState([
        { role: 'user', content: '' },
    ])

    function setListItem(item, index) {
        setList(list.map((v, i) => {
            if (i === index) {
                return item
            }
            return v
        }))
    }

    function setListItemByID(item, id) {
        let add = true
        if(id){
            setList(list.map((v) => {
                if (v.id === id) {
                    add = false
                    return item
                }
                return v
            }))
        } else {
            console.warn('no id')
        }
        

        if(add){
            setList([...list, item])
        }
    }

    useImperativeHandle(ref, () => ({
        getMessages: () => {
            return list
        },
        setMessages: (val) => {
            if(val && val.map){
                setList(val)
            }
        },
        streamChat: (data, messages, setLoading = () => {}) => { // 文字流式请求
            setLoading(true)
            let isEnd = false
            return fetchEventSource(chatCompletions, {
              method: 'POST',
              credentials: 'same-origin',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': getToken(),
                'X-Host': XHost
              },
              body: JSON.stringify({
                ...data,
                messages:[{ role: 'system', content: data.prompt }, ...messages]
            }),
              openWhenHidden: true,
              onopen(response) {
                if (response.ok) {
                  return
                }
                if (response.status >= 400) {
                  // client-side errors are usually non-retriable:
                  setLoading(false)
                  console.log(response)
                  notification.error({
                    message: response.status,
                    description: t('pageMain.errorMsg'),
                  })
                  throw new Error('response.status error')
                }
              },
              onmessage(msg) {
                // if the server emits an error message, throw an exception
                // so it gets handled by the onerror callback below:
                if (msg.event === 'FatalError') {
                    setLoading(false)
                    throw new Error(msg.data)
                }
                if (msg.data === '[DONE]') {
                    setLoading(false)
                    isEnd = true
                    return
                }
                const data = JSON.parse(msg.data)
                if (data.lastOne) {
                isEnd = true
                  setLoading(false)
                }
                setListItemByID({ role: 'assistant', content: data.content, id: data.id }, data.id)
                // console.log('msg.data', data, list)
              },
              onclose() {
                setLoading(false)
                if(isEnd){
                    //
                } else {
                    throw new Error('close unexpectedly')
                }
              },
              onerror(err) {
                sendEvents('pgStreamError')
                Analytics.record({
                    name: 'pgStreamError',
                    attributes: {
                        error: err
                    }
                })
                setLoading(false)
                throw err
              }
            })
        }
    }))

    return <div className="message-list">
        {list.map((v, index) => {
            return <div className="message-list-item" key={v.id || index}>
                <div className="message-list-role"
                    onClick={() => {
                        if (v.role === 'user') {
                            setListItem({
                                role: 'assistant',
                                content: v.content
                            }, index)
                        } else {
                            setListItem({
                                role: 'user',
                                content: v.content
                            }, index)
                        }
                    }}>
                        <div className="message-list-role-name">
                            {t(`pageMain.${v.role}`)}
                        </div>
                    </div>
                <TextArea
                    className="message-prompt-input"
                    placeholder={t(`pageMain.msgPlaceHolder`)}
                    onChange={(e) => {
                        setListItem({
                            role: v.role,
                            content: e.target.value
                        }, index)
                    }}
                    value={v.content}
                    autoSize />
                <MinusCircleOutlined className='delete-icon' onClick={() => {
                    setList(list.filter((v, i) => i !== index))
                }} />
            </div>
        })}
        <div className='message-list-bottom'>
            <div className="message-list-bottom-left" onClick={() => {
                if(list[list.length - 1] && list[list.length - 1].role === 'user'){
                    setList([...list, { role: 'assistant', content: '' }])
                } else {
                    setList([...list, { role: 'user', content: '' }])
                }
            }}>
                <Icon className="y-icon y-icon-plus" component={PlusSvg}></Icon>
                <span>{t(`pageMain.addMsg`)}</span>
            </div>
            <div className="message-list-bottom-right" onClick={() => {
                setList([{ role: 'user', content: '' }])
            }}>
                <Icon className="y-icon y-icon-trash" component={TrashSvg}></Icon>
                <span>{t(`pageMain.clearList`)}</span>
            </div>
        </div>
    </div>
}

const MessageList = forwardRef(MessageListFn)

export { MessageList }