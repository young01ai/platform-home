'use client'

import { oauthCallback, getLoginUrl } from "@/api/login"
import './index.scss'
import { useState, useEffect } from 'react'
import { Spin } from 'antd'

import { useTranslation } from 'react-i18next'
import '../i18n'
import { store as localStore } from '@/util/store'
import { getBrowserLang } from '@/util/languageUtil.js'

const Page = () => {
  const { t, i18n } = useTranslation()
  const [fail, setFail] = useState(false)
  let from = ''
  if (typeof window !== 'undefined'){
    from = new URLSearchParams(window.location.search).get('from')
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const code = new URLSearchParams(window.location.search).get('code') || ''
      if (code) {
        oauthCallback(code).then(res => {
          if (res.status === 0) {
            setTimeout(() => {
              // window.close()
            }, 200)
          } else {
            setFail(true)
          }
        }).catch(e => {
          setFail(true)
        })


      } else {
        // console.log(getLoginUrl(from))
        window.location.href = getLoginUrl(from)
      }
    }



  }, [])

  useEffect(() => {
    /**
     * 缓存语言
     */
    const projectLanguageLast = localStore.get('projectLanguageLast')

    let default_language = projectLanguageLast || 'zh'
    if (!projectLanguageLast) {
      /**
      * 浏览器语言默认语言 
      */
      const browserLang = getBrowserLang()

      if (browserLang) {
        default_language = browserLang
      }
      // 设置localstorage中的浏览器语言
      localStore.set('browserLanguageLast', default_language)
      // 设置localstorage中的项目语言
      localStore.set('projectLanguageLast', default_language)
    }

    i18n.changeLanguage(default_language)
    localStore.set('projectLanguageLast', default_language)
  }, [])


  if (!fail) {
    return (
      <div className="login-doing"><Spin></Spin></div>
    )
  } else {
    return (
      <div className="login-doing">
        {t('page.pageError')}<a className="login-doing-a" href={getLoginUrl(from)}>{t('header.notLogin')}</a>
      </div>
    )
  }

}

export default Page