'use client'

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
// import LanguageDetector from 'i18next-browser-languagedetector'

// 引入翻译文件
import translationEN from '../i18n/en.js'
import translationCN from '../i18n/zh.js'
import translationAR from '../i18n/ar.js'
import translationHKG from '../i18n/hkg.js'
// 资源文件
const resources = {
  en: {
    translation: translationEN
  },
  zh: {
    translation: translationCN
  },
  ar: {
    translation: translationAR
  },
  hk: {
    translation: translationHKG
  }
}

const default_language = 'en'
i18n
  .use(initReactI18next) // 通过 use 连接 react-i18next 必须调用 initReactI18next
  //   .use(LanguageDetector) // 增加语言检测
  .init({
    debug: true,
    resources,
    fallbackLng: default_language, // 默认语言
    lng: default_language, // 如果使用了 LanguageDetector 则可以不用指定
    interpolation: {
      escapeValue: false // 不需要对输出进行转义
    }
  })

export default i18n
