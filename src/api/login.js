import { store } from '@/util/store'
import { baseUrl, XHost } from './util'

const isBrowser = () => typeof window !== 'undefined'

let redirect_uri = ''
if(isBrowser()){
    redirect_uri = encodeURIComponent(`${window.location.protocol}//${window.location.host}/login`)
}

function getRedirectUri(from){
    if(isBrowser()){
        let url = `${window.location.protocol}//${window.location.host}/login`
        if(from){
            url += `?from=${from}`
        }
        return encodeURIComponent(url)
    }
    
    return redirect_uri
}

export const getFeishuOauth = function (from){
    return `https://open.feishu.cn/open-apis/authen/v1/user_auth_page_beta?app_id=cli_a42ffa2328fdd00b&redirect_uri=${getRedirectUri(from)}&state=state`
}
export function oauthAuthing(){
    return (baseUrl + `/oauth/authing/login`)
}

export function oauthCallbackFeishu(code){
    return fetch(baseUrl + `/oauth/feishu/callback?code=${code}&state=state`, {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        headers: {
            "Content-Type": "application/json",
        }
    }).then(async res => {
        const rt = await res.json()
        if(res.status === 200){
            token = rt.data.token
            store.set('user-token', token)
            return rt
        } else {
            console.error('oauthCallbackFeishu error', res)
            return rt
        }
    })
}

export function oauthCallbackAuth(code){
    return fetch(baseUrl + `/oauth/authing/callback?code=${code}`, {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        headers: {
            "Content-Type": "application/json",
        }
    }).then(async res => {
        const rt = await res.json()
        console.log(rt)
        if(res.status === 200){
            token = rt.data.token
            store.set('user-token', token)
            return rt
        } else {
            console.error('oauthCallbackAuth error', res)
            return rt
        }
    })
}


let token = ''
export function getToken(){
    if(token){
        return token
    } else {
        const oldToken = store.get('user-token')
        if(oldToken){
            token = oldToken
            return token
        } else {
            console.warn('no old token')
            return token
        }
    }
}

export function setToken(val) {
    token = val
}

export function shouldLoginFeishu() {
    if(XHost !== 'platform.lingyiwanwu.com' && XHost !== 'platform.pre.lingyiwanwu.com'){
        return true
    } else {
        // console.log('shouldLoginFeishu', XHost)
        return false
    }
}

export function getLoginUrl(from) {
    const flag = shouldLoginFeishu()
    // console.log('getLoginUrl', flag)
    if(flag){
        return getFeishuOauth(from)
    }else {
        return oauthAuthing()
    }
}

export function oauthCallback(code){
    const flag = shouldLoginFeishu()
    // console.log('oauthCallback', flag)
    if(flag){
        return oauthCallbackFeishu(code)
    } else {
        return oauthCallbackAuth(code)
    }
}
let loginShow = false
export function loginHandler(){
    if(loginShow){
        // console.log('!!!!')
    } else {
        window.addEventListener("storage", function(e){
            if (e.key === 'y-user-token') {
                // console.log('!!!!!', e)
                window.location.reload()
            }
        })
        let a = document.createElement('div')
        a.className = 'login-wrapper'
        a.onclick = (e) => {
            loginShow = false
            e.target.remove()
        }
        a.innerHTML = '<iframe class="login-iframe" src="/login"/>'
        document.body.appendChild(a)
        loginShow = true
    }
   
}
export function logoutHandler(){
    if (typeof window !== 'undefined') {
        const params = {
            method: "PUT", // *GET, POST, PUT, DELETE, etc.
            headers: {
                "Content-Type": "application/json",
                "Authorization": getToken(),
            }
        }
        params.headers["X-Host"] = XHost
        return fetch(baseUrl + `/oauth/authing/logout`, params).then(async res => {
            if (XHost === "platform.lingyiwanwu.com" ||  XHost === 'platform.pre.lingyiwanwu.com') {
                open("http://01ai-playground.authing.cn/oidc/session/end")
            }
            store.storage.removeItem('y-user-token')
            window.location.reload()
        })
    }
}
