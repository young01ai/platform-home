import { XHost, commonGet, commonPut, commonPost, baseUrl } from './util'
import { store } from '@/util/store'

export const chatUrl = baseUrl + '/web/v1/stream/chat'

// 通话流程
export function completion(list) {
  const data = {
    appId: 'aigc_web',
    // appId: 'common',
    messages: list.map(v => {
      return {
        // role: v.type === 'gpt' ? Enum.gpt : v.type,
        content: v.text
      }
    })
  }

  return commonPost(`/web/v1/chat/completions`, data).catch(err => {
    errReport(err, 'completionError')
    throw err
  })
}

// sso配置
export function config() {
  return commonGet(`/web/v1/sso`).catch(err => {
    errReport(err, 'getSsoError')
    throw err
  })
}

// 获取推荐prompt
export function getPrompt() {
  return commonGet(`/web/v1/prompt/recommend`).catch(err => {
    errReport(err, 'getPromptError')
    throw err
  })
}
export function getQuote() {
  return commonGet(`/web/v1/prompt/quote`).catch(err => {
    errReport(err, 'getQuoteError')
    throw err
  })
}

// 计算tiktoken
export function countToken(prompt) {
  const data = { prompt }

  return commonPost(`/web/v1/token/count`, data).catch(err => {
    errReport(err, 'completionError')
    throw err
  })
}
// 消息赞踩
export function vote(data) {
  return commonPost(`/web/v1/conversation/message/vote`, data).catch(err => {
    errReport(err, 'completionError')
    throw err
  })
}
// 对话列表
export function getConversationList() {
  return commonGet(`/web/v1/conversation/list`).then(async res => {
    return res
  })
}
// 新建对话
export function createConversation({ model, language }) {
  const data = {
    model: model || '',
    language: language || 'zh'
  }

  return commonPost(`/web/v1/conversation/create`, data).catch(err => {
    errReport(err, 'createConversationError')
    throw err
  })
}
// 分享赞踩
export function shareVote(shareKey, vote0) {
  const data = {
    shareKey,
    vote: vote0
  }

  return commonPost(`/web/v1/conversation/share/vote`, data).catch(err => {
    errReport(err, 'shareVoteError')
    throw err
  })
}
// 对话详情
export function getConversationDetail(conversationId) {
  return commonGet(`/web/v1/conversation/detail?conversationId=${conversationId}`).catch(err => {
    errReport(err, 'getConversationDetailError')
    throw err
  })
}
// 
export function deleteConversation(conversationId) {
  const data = { conversationId }

  return commonPost(`/web/v1/conversation/delete`, data).catch(err => {
    errReport(err, 'deleteConversationError')
    throw err
  })
}
// 
export function getShareDetail(shareKey) {
  return commonGet(`/web/v1/conversation/share/detail?shareKey=${shareKey}`).catch(err => {
    errReport(err, 'getShareDetailError')
    throw err
  })
}
// 
export function createShare(conversationId, messageIds) {
  const data = {
    conversationId,
    messageIds
  }

  return commonPost(`/web/v1/conversation/share/create`, data).catch(err => {
    errReport(err, 'createShareError')
    throw err
  })
}
// 
export function editConversation(conversationId, title, model) {
  const data = {
    conversationId,
    title,
    model
  }

  return commonPost(`/web/v1/conversation/edit`, data).catch(err => {
    errReport(err, 'editConversationError')
    throw err
  })
}
// 
export function getUserInfo() {
  return commonGet(`/web/v1/user`).catch(err => {
    errReport(err, 'getUserInfoError')
    throw err
  })
}
// 
export function getUserInfoNoOpen() {
  return commonGet(`/web/v1/user`).catch(err => {
    errReport(err, 'getUserInfoNoOpenError')
    throw err
  })
}

// 获取推荐Model
export function getModel(full) {
  let target = `/web/v1/models`
  if (full) {
    target += '?models=full'
  }
  return commonGet(target).catch(err => {
    errReport(err, 'getModelError')
    throw err
  })
}

// 上传图片url
export function getUploadUrl(filename) {
  return commonGet(`/web/v1/image-upload?filename=${filename}`).catch(err => {
    errReport(err, 'getUploadUrlError')
    throw err
  })
}

// 上传doc
export function getDocUploadUrl(filename) {
  return commonGet(`/web/v1/doc-upload?filename=${filename}`).catch(err => {
    errReport(err, 'getDocUploadUrl')
    throw err
  })
}

function errReport(err, eventName) {
  let str = ''
  if (err.toString) {
    str = err.toString()
  }
  // Analytics.error({
  //   eventName,
  //   log: str
  // })
}
