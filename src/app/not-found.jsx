'use client'

import Link from 'next/link'
import './i18n'
import { useTranslation } from 'react-i18next'
import React, { useEffect } from 'react'
import { store as localStore } from '@/util/store'
import { getBrowserLang } from '@/util/languageUtil.js'
 
export default function NotFound() {
  const { t, i18n } = useTranslation()

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

  return (
    <div style={{
        textAlign: 'center'
    }}>
      <h2>{t('page.page404')}</h2>
      <Link href="/">{t('page.backHome')}</Link>
    </div>
  )
}
