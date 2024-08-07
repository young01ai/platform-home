
export const fetcher = (...args) => fetch(...args).then((res) => res.json())

export function timeago(dateTimeStamp = Number.MAX_VALUE) {
    // console.log('dateTimeStamp', dateTimeStamp)
    const minute = 1000 * 60      //把分，时，天，周，半个月，一个月用毫秒表示
    const hour = minute * 60
    const day = hour * 24
    const week = day * 7
    const month = day * 30
    const now = new Date().getTime()   //获取当前时间毫秒
    // console.log(now)
    const diffValue = now - dateTimeStamp//时间差

    if (diffValue < 0) {
        return 'Just now'
    }
    const minC = diffValue / minute  //计算时间差的分，时，天，周，月
    const hourC = diffValue / hour
    const dayC = diffValue / day
    const weekC = diffValue / week
    const monthC = diffValue / month
    let result = ''
    //此处考虑小数情况，感谢 情非得已https://blog.csdn.net/weixin_48495574 指正
    if (monthC >= 1 && monthC < 4) {
        result = " " + parseInt(monthC) + " month ago"
    } else if (weekC >= 1 && weekC < 4) {
        result = " " + parseInt(weekC) + " weeks ago"
    } else if (dayC >= 1 && dayC < 7) {
        result = " " + parseInt(dayC) + " days ago"
    } else if (hourC >= 1 && hourC < 24) {
        result = " " + parseInt(hourC) + " hours ago"
    } else if (minC >= 1 && minC < 60) {
        result = " " + parseInt(minC) + " minutes ago"
    } else if (diffValue >= 0 && diffValue <= minute) {
        result = "Just now"
    } else {
        const datetime = new Date()
        datetime.setTime(dateTimeStamp)
        const Nyear = datetime.getFullYear()
        const Nmonth = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1
        const Ndate = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate()
        // const Nhour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours()
        // const Nminute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes()
        // const Nsecond = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds()
        result = Nyear + "-" + Nmonth + "-" + Ndate
    }
    return result
}
export function sendEvents(event_name, params){
    window.gtag('event', event_name, params)
}


function fallbackCopyTextToClipboard (text) {
    const textArea = document.createElement('textarea')
    textArea.value = text
  
    // Avoid scrolling to bottom
    textArea.style.top = '0'
    textArea.style.left = '0'
    textArea.style.position = 'fixed'
  
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
  
    try {
      var successful = document.execCommand('copy')
      var msg = successful ? 'successful' : 'unsuccessful'
      console.log('Fallback: Copying text command was ' + msg)
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err)
    }
  
    document.body.removeChild(textArea)
    // eslint-disable-next-line no-undef
    return Promise.resolve()
  }
  export function copyTextToClipboard (text) {
    if (!navigator.clipboard) {
      return fallbackCopyTextToClipboard(text)
    }
    return navigator.clipboard.writeText(text).then(
      function () {
        // console.log('Async: Copying to clipboard was successful!')
      },
      function (err) {
        console.error('Async: Could not copy text: ', err)
      }
    )
  }
  