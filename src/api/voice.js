import { commonGet, commonPost } from './util'

// const baseUrl = 'https://tts-demo.01ww.xyz'
const baseUrl = 'http://127.0.0.1:7755'

export function getConfig() {
  return commonGet(`/v1/rtc/config`, false, baseUrl).catch(err => {
    errReport(err, 'getConfig')
    throw err
  })
}

export function join_channel(data) {
  return commonPost(`/v1/rtc/join_channel`, data, false, baseUrl).catch(err => {
    errReport(err, 'join_channel')
    throw err
  })
}

export function quit_channel(data) {
  return commonPost(`/v1/rtc/quit_channel`, data, false, baseUrl).catch(err => {
    errReport(err, 'quit_channel')
    throw err
  })
}


export function muteVoice(data) {
  return commonPost(`/v1/rtc/user_state/mute`, data, false, baseUrl).catch(err => {
    errReport(err, 'muteVoice')
    throw err
  })
}

export function unmuteVoice(data) {
  return commonPost(`/v1/rtc/user_state/unmute`, data, false, baseUrl).catch(err => {
    errReport(err, 'unmuteVoice')
    throw err
  })
}

export function getList(uid) {
  return commonGet(`/v1/rtc/chat_content/${uid}`, false, baseUrl).catch(err => {
    errReport(err, 'getList')
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
