'use client'

import './globals.css'
import './global.scss'


import Image from 'next/image'
import Script from 'next/script'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { UserProvider } from '@/components/UserInfo/userInfoContext'

import Language from "./language"
import UserInfo from "@/components/UserInfo"
import StyledComponentsRegistry from "@/lib/AntdRegistry"

import './i18n'
import { useTranslation } from 'react-i18next'
import { store as localStore } from '@/util/store'
import { getBrowserLang } from '@/util/languageUtil.js'

import { isVIP } from '@/api/util'

export default function RootLayout({ children }) {
  const pathname = usePathname()
  const { t, i18n } = useTranslation()

  const [pageLanguage, setPageLanguage] = useState("")

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
    setPageLanguage(default_language)
  }, [])

  const items = [
    {
      label: (
        <a href="/chat" data-active={pathname === '/chat'}>
          <span className="header-item">{t('header.chat')}</span>
        </a>
      ),
      key: 'chat',
    },
    {
      label: (
        <a href="/prompt/playground" data-active={pathname === '/prompt/playground'}>
          <span className="header-item">{t('header.playground')}</span>
        </a>
      ),
      key: 'playground',
    },
  ]

  if (isVIP()) {
    items.push(
      {
        label: (
          <a href="http://101.126.6.209:7860" target='_blank'>
            <span className="header-item">{t('header.stableDiffusion')}</span>
          </a>
        ),
        key: 'stableDiffusion',
      })
  }

  return (
    <html lang="en">
      <title>{t('page.title')}</title>
      <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-L4X6ZJDX9E" />
      <Script
        id='google-analytics'
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-L4X6ZJDX9E');
        `,
        }}
      />
      <body data-lang={i18n.language} hidden={pageLanguage === ''}>
        <UserProvider>
            <div className="app-header">
            <a className="slogan" href='https://www.lingyiwanwu.com/' target='_blank'>
                <Image className="logo" src="/assets/icon.svg" width={80} height={56} alt="logo"></Image>
            </a>
            <div className="y-menu">
                {items.map(v => {
                return <div key={v.key} className="y-menu-item" >{v.label}</div>
                })}
            </div>
            {/* ---{pageLanguage}=== */}
            {(pathname !== '/' && pathname !== '/login') ? <Language language={pageLanguage}></Language> : null}
            {(pathname !== '/' && pathname !== '/login') ? <UserInfo></UserInfo> : null}
            </div>
            
            <StyledComponentsRegistry>
                {children}
            </StyledComponentsRegistry>

        </UserProvider>
      </body>
    </html>
  )
}
