'use client'
import React, { useEffect, useRef, useState, useMemo } from "react"
import { unstable_batchedUpdates } from "react-dom" //批量更新状态时使用
import { copyTextToClipboard } from "@/util/yUtil"

import PlatformLayout from "@/app/platformLayout"
import { message } from "antd"
import Icon from '@ant-design/icons'
import ModelSelect from "@/app/chat/components/modelSelect"
import { MessageList, statusEnum } from '@/app/chat/components/message'

import { getShareDetail, shareVote } from "@/api/chat"
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'next/navigation'

import "./share.scss"
import "@/app/chat/app.scss"

const Share = ({ shareId }) => {
  const [messageApi, contextHolder] = message.useMessage()
  const { t,i18n } = useTranslation()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [messageList, setMessageList] = useState([]) // 当前对话包含的消息列表
  const [shareKey, setShareKey] = useState(shareId)
  const [upCount, setUpCount] = useState(0)
  const [readCount, setReadCount] = useState(0)
  const [vote, setVote] = useState(0)
  const [postVote, setPostVote] = useState(0)
  const [creatorName, setCreatorName] = useState("")
  const [model, setModel] = useState("Yi-34B-Chat-V04")

  const messageListRef = useRef()
  useEffect(() => {
    handleGetShareDetail()
  }, [])

  useEffect(() => {
    if (vote === 0) setPostVote(1)
    if (vote === 1) setPostVote(0)
  }, [vote])

  const handleGetShareDetail = async () => {
    if (!shareKey) messageApi.open({
        type: 'error',
        content: "请确定分享的地址是否正确"
      })
    try {
      const res = await getShareDetail(shareKey)

      unstable_batchedUpdates(()=>{
        setMessageList(res?.data?.messageList || [])
        setUpCount(res?.data?.upCount || 0)
        setReadCount(res?.data?.readCount || 0)
        setVote(res.data.vote)
        setCreatorName(res.data.creatorName)
        setModel(res.data.model)
      })

    } catch (e) {
      setError(e.message || t("page.pageError"))
    } finally {
      setLoading(false)
    }
  }

  const shareConversation =() => {
    const href = window.location.href
    copyTextToClipboard(href).then(() => messageApi.open({
        type: 'success',
        content: t('content.shareCopySuccess')
      }))
  }

  return <div className="overflow-hidden w-full relative">
      {contextHolder}
  <div className="flex-1 flex-col">
    <main className="relative w-full transition-width flex flex-col overflow-hidden items-stretch flex-1">
      <div className="flex overflow-y-auto" style={{marginBottom:'60px'}}>
        <div className="flex mx-auto content-width-wrapper">
        { loading && <div className="text-center text-white text-3xl pt-20 pb-20"><Icon type="loading" className="mr-4" />加载中...</div> }
        {error && <div className="text-center text-white text-3xl pt-20 pb-20">{t('page.pageError')}</div>}
        {!loading && !error && messageList.length > 0 &&
          (
            <div className="w-full">
              <div className="message-content-wrapper share-modal">
                <div className="share-modal-wrapper">
                  <ModelSelect val={model} disabled={true}></ModelSelect>
                </div>
              </div>
              <MessageList ref={messageListRef} list={messageList} isShare={true} newName={creatorName}></MessageList>
            </div>
          )}
        </div>
      </div>
    </main>
  </div>
</div>
}

export default function PageShare() {
  const query = useSearchParams()
  return (
    <PlatformLayout>
      <Share shareId={query.get('shareId')}></Share>
    </PlatformLayout>
  )
}