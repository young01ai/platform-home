import { baseUrl, commonGet } from './util'


export const chatCompletions = baseUrl + '/web/v1/chat/completions'


export function getUserInfo(){
    return commonGet(`/web/v1/user`).then(async res => {
        return res
    })
}

export function getModels(full){
    let target = `/web/v1/models`
    if(full){
        target += '?models=full'
    }
    return commonGet(target, false).then(async res => {
        return res
    })
}