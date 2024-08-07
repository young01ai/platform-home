import {
  Checkbox,
  message
} from 'antd'

import { copyTextToClipboard } from '@/util/yUtil'
import { vote } from '@/api/chat'
import MdShow from '@/components/Markdown/Markdown'
import './message.scss'
import IconButton from '@/components/IconButton'

import  { useState, useEffect, useRef, forwardRef, useImperativeHandle} from 'react'
import { useTranslation } from 'react-i18next'

export const Enum = {
  user: 'user',
  gpt: 'assistant'
}

export const statusEnum = {
  loading: 'loading',
  error: 'error',
  streaming: 'streaming',
  done: 1
}

const MessageListFn = ({
  list,
  setList,
  conversationId,
  isShare,
  readyToShare,
  name,
  shareClick,
  setCheckAll,
  setCheckedLength
}, ref) => {
  const endRef = useRef()
  const { t } = useTranslation()
  const [checkedList, setCheckedList] = useState([])

  useEffect(() => {
    if(readyToShare){
      if(list.length >= 2 && checkedList.length === 0){
        setCheckedList([list[list.length - 1].messageId, list[list.length - 2].messageId])
      } 
    } else {
      setCheckedList([])
    }
    
  }, [readyToShare])

  const checkBox = (messageId) => {
    let flag = false
    setCheckedList(checkedList.filter(v => {
      if (v === messageId) {
        flag = true
        return false
      }
      return true
    }))
    if (flag) {
      // 
    } else {
      setCheckedList(val => {
        val.push(messageId)
        return val
      })
    }
  }


  const getGptItem = (v, idx) => {
    // console.log(v)
    if (v.status === statusEnum.done || v.status === statusEnum.streaming) {
      return <div className="min-h-[20px] flex items-start">
        {/* <div className="flex-1">{v.text}</div> */}
        <MdShow content={v.content}></MdShow>
      </div>
    }
    if (v.status === statusEnum.error) {
      return <div className="text-red-500 py-2 px-3 border text-gray-600 rounded-md text-sm dark:text-gray-100 border-red-500 bg-red-500/10">{v.errorMsg || 'Something went wrong'}</div>
    }
    if (v.status === statusEnum.loading) {
      return <div className="result-streaming"><p className='cursor'></p></div>
    }
  }

  const postVote = async (data, dealList = true) => {
    // console.log('data', data, list)
    if(data?.v?.messageId){
      try {
        const res = await vote({ conversationId, messageId: data.v.messageId, vote: data.vote })
        // console.log('res', res)
        if(res.data && dealList){
          data.v.vote = data.vote
          const newV = list.map((v, i) => {
            if(i === data.idx){
              return data.v
            } else {
              return v
            }
          })
          setList(newV)
        }
        
      } catch (e) {
        message.error(t('content.oprateFail') + e.message)
      }
    }
  }

  useEffect(() => {
    if(isShare){
//
    } else {
      setCheckAll && setCheckAll(checkedList.length === list.length)
      setCheckedLength(checkedList.length)
    }
    
  }, [list, checkedList, setCheckAll])

  useImperativeHandle(ref, () => ({
    scrollEnd() {
      endRef.current.scrollIntoView()
    },
    getCheckList() {
      return checkedList
    },
    checkEndVisible() {
      const endEl = endRef.current
      // console.log(endEl.getBoundingClientRect().top, window.innerHeight - 80)
      return endEl.getBoundingClientRect().top < window.innerHeight - 80
    },
    toggleCheckAll(){
      if(checkedList.length === list.length){
        setCheckedList([])
      } else {
        setCheckedList(list.map(v => v.messageId))
      }
    },
    postVote
  }))

  return <div className="message-list">
      <div className="message-content-wrapper">
        {list.map((v, idx) => {
          if (v.role === Enum.user) {
            let tmpDocFileSplit = v.docFilePath?.split('/') || []
            return <div className="message-user-container" key={idx}>
              {
                readyToShare ? <Checkbox checked={checkedList.filter(t => t === v.messageId).length > 0} key={idx} onChange={() => {
                  checkBox(v.messageId)
                }}></Checkbox>
                  : undefined
              }
              <div className="user-icon">{(name || '用').substring(0, 1)}</div>
              <div className="flex flex-grow flex-col">
                {v.fullImagePath ? <img className="user-upload-img" src={v.fullImagePath} /> : null}
                {v.imageList ? v.imageList.map(v => {
                  return <img key={v} className="user-upload-img" src={v} />
                }) : null}
                {v.docFilePath ? <div className="file-content-wrapper" onClick={() => {
                  // window.open(v.docFilePath,
                  // 'pdfWindow','height=600,width=800,screenX=100,screenY=100')
                }}>
                  <div className="y-icon y-icon-pdf"></div>
                  <h1 className="file-name">{tmpDocFileSplit[tmpDocFileSplit.length - 1]}</h1>
                </div> : null }
                <div className="text-wrapper">{v.content}</div>
              </div>
            </div>
          } else {
            return <div className="message-assistant-container" key={idx}>
              {
                readyToShare ? <Checkbox checked={checkedList.filter(t => t === v.messageId).length > 0} key={idx} onChange={() => {
                  checkBox(v.messageId)
                }}></Checkbox>
                  : undefined
              }
              <div className="model-icon-wrapper">
                <img className="model-icon" src="https://webstatic.01ww.xyz/assets/modal.svg" alt="" />
              </div>
              <div className="message-assistant-content">
                {getGptItem(v, idx)}
                <div className="bottom-btn" hidden={v.status !== statusEnum.done || isShare}>
                  <IconButton selected={v.vote === 1} disabled={v.vote === -1} type="like"  clickFn={() => {
                    if (v.vote === 1) {
                      postVote({ v, idx, vote: 0 })
                    } else {
                      postVote({ v, idx, vote: 1 })
                    }
                  }}></IconButton>
                  <span className='inline-block' style={{ transform: `rotate(180deg)`}}>
                    <IconButton selected={v.vote === -1} disabled={v.vote === 1} type="like"  clickFn={() => {
                      if (v.vote === -1) {
                        postVote({ v, idx, vote: 0 })
                      } else {
                        postVote({ v, idx, vote: -1 })
                      }
                    }}></IconButton>
                  </span>
                  <IconButton type="copy" clickFn={() => {
                    copyTextToClipboard(v.content).then(res => {
                      message.success(t('content.copySuccess'), 3)
                    })
                  }}></IconButton>
                  {readyToShare ? null : <IconButton type="share" clickFn={() => {
                    setCheckedList([v.messageId])
                    shareClick()
                  }}></IconButton>}
                </div>
              </div>
            </div>
          }
        })}
      </div>
      <div ref={endRef} className="message-end"></div>
    </div>
  
}


const MessageList = forwardRef(MessageListFn)

export { MessageList }