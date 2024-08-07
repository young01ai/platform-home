import { getToken, setToken, loginHandler } from "./login"


export let XHost = ''
if(typeof window !== 'undefined'){
    XHost = window.location.host
}

// XHost = 'webstatic-test.01ww.xyz'
// XHost = 'webstatic.01ww.xyz'
// XHost = 'platform.lingyiwanwu.com'
// XHost = 'platform.pre.lingyiwanwu.com'

export const baseUrl = (XHost === 'webstatic-test.01ww.xyz' || XHost === 'platform.pre.lingyiwanwu.com') ? 'https://api.pre.lingyiwanwu.com' : 'https://api.lingyiwanwu.com'

export function isVIP(){
  return XHost === "webstatic.01ww.xyz" || XHost === "webstatic-test.01ww.xyz"
}


function commonFetch(method, url, data, checkLogin = true, baseUrl1) {
  const param = {
    method, // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
      "Authorization": getToken(),
      "X-Host": XHost
    },
  }
  if (data) {
    param.body = JSON.stringify(data)
  }
  return fetch(baseUrl1 + url, param).then(async res => {
    const rt = await res.json()
    if (checkLogin && res.status === 401) {
      setToken('')
      loginHandler()
      return rt
    } else {
      if (res.status !== 200) {
        console.error('status not 200 error', res)
      }
      return rt
    }
  })
}

export function commonGet(url, checkLogin = true, baseUrl1 = baseUrl) {
  return commonFetch('GET', url, '', checkLogin, baseUrl1)
}

export function commonPut(url, data, checkLogin = true) {
  return commonFetch('PUT', url, data, checkLogin)
}

export function commonPost(url, data, checkLogin = true, baseUrl1 = baseUrl) {
  return commonFetch('POST', url, data, checkLogin, baseUrl1)
}