'use client'
import { useState } from "react"
import { Button } from 'antd'
import { leaveSession, mutedAudio, startBasicCall, createMic } from './rtc'
import Voice from '@/components/lottie/voice'
import {
  getConfig,
  join_channel,
  getList,
} from '@/api/voice'

import '../globals.css'
import '../global.scss'
import './webRTC.scss'


export const Enum = {
  user: 'user',
  gpt: 'assistant'
}

export default function WebRTC() {
  const [list, setList] = useState([])

  const [holding, setHolding] = useState(false)
  // const [volume, setVolume] = useState(0)
  const [rtcConfig, setRtcConfig] = useState({})
  const [rtcState, setRtcState] = useState('DISCONNECTED')
  const [mic, setMic] = useState()

  const appendListById = ({message_id, content, role}) => {
    setList(list => {
      const target = list.find(v => v.message_id === message_id)
      if(target){
        target.content = content
        return [...list]
      } else {
        return [...list, {message_id, content, role}]
      }
    })
  }

  const startVoiceAction = async function (cfg) {
    join_channel({
      channel_id: cfg.channel_id,
      client_user_id: cfg.client_user_id,
      index: cfg.index
    }).then(res => {
      startBasicCall({
        setRtcState,
        // setVolume,
        setMic,
        config: cfg,
        appendListById
      })
    })
  }

  useState(() => {

    getConfig().then(res => {
      console.log(res)
      if(res.code === 0){
        const cfg = {
          ...res.data,
          index: new Date().getTime()
        }
        setRtcConfig(cfg)
        startVoiceAction(cfg)
      }
    })

    
  }, [])

  return (
    <div className="webRTC-container" 
    onMouseUp={() => {
      if(holding){
        setHolding(false)
        setTimeout(() => {
          mutedAudio(true)
        }, 468)
      }
    }}
    onTouchEnd={() => {
      if(holding){
        setHolding(false)
        setTimeout(() => {
          mutedAudio(true)
        }, 468)
      }
    }}
    >
      <div className="message-list">
        <div className="message-content-wrapper">
          {list.map((v, idx) => {
            if (v.role === Enum.user) {
              return <div className="message-user-container" key={idx}>
                <div className="user-icon">{(name || '用').substring(0, 1)}</div>
                <div className="flex flex-grow flex-col">
                  <div className="text-wrapper">{v.content}</div>
                </div>
              </div>
            } else {
              return <div className="message-assistant-container" key={idx}>
                <div className="model-icon-wrapper">
                  <img className="model-icon" src="https://webstatic.01ww.xyz/assets/modal.svg" alt="" />
                </div>
                <div className="message-assistant-content">
                  <div className="flex flex-grow flex-col">
                    <div className="text-wrapper">{v.content}</div>
                  </div>
                </div>
              </div>
            }
          })}
        </div>
        <div className="message-end-rtc"></div>
      </div>
      <div className="bottom-bar">
        <Button 
        size="large"
        className="hold-button" 
        onContextMenu={(e) => {
          e.preventDefault()
        }}
        onMouseDown={() => {
          setHolding(true)
          mutedAudio(false)
        }}
        onTouchStart={() => {
          setHolding(true)
          mutedAudio(false)
        }}
        hidden={rtcState === 'DISCONNECTED'}
        >{holding ? '松开结束' : '按住说话'}</Button>
        <div className="ml-2" hidden={!holding}>
          <Voice />
        </div>
        <Button 
        size="large"
        className="ml-2"
        hidden={rtcState !== 'DISCONNECTED'}
        onClick={() => {
          startVoiceAction(rtcConfig)
        }}>重新加入对话</Button>

        <Button 
        size="large"
        className="ml-2"
        hidden={rtcState === 'DISCONNECTED'}
        onClick={() => {
          leaveSession()
        }}>退出对话</Button>

        <Button 
        size="large"
        className="ml-2"
        hidden={mic === undefined || mic === true}
        onClick={() => {
          createMic(setMic)
        }}>无权限访问麦克风，点击获取</Button>

        {/* <div className="flex gap-4">
          
          <button type="button" onClick={() => {
            leaveSession()
          }}>LEAVE</button>
          <button type="button" onClick={() => {
            mutedAudio(true)
          }}>mute</button>
        </div> */}
      </div>
      </div>
  )
}