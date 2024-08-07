'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { store as localStore } from '@/util/store'
import './language.scss'

const Language = ({ language }) => {

    const { i18n } = useTranslation()
    const [pageLanguage, setPageLanguage] = useState(language)

    useEffect(() => {
        setPageLanguage(language)
    }, [language])

    const projectLanguageChange = (language) => {
        let _language = language
        i18n.changeLanguage(_language)
        localStore.set('projectLanguageLast', _language)
        setPageLanguage(_language)
    }

    return (
        <div className='language-container'>
            <div className={`language-name ${pageLanguage === 'zh' ? 'language-checked' : ''}`} onClick={() => projectLanguageChange('zh')}>中文</div>
            <div className={`language-name ${pageLanguage === 'en' ? 'language-checked' : ''}`} onClick={() => projectLanguageChange('en')}>En</div>
            <div className={`language-name ${pageLanguage === 'ar' ? 'language-checked' : ''}`} onClick={() => projectLanguageChange('ar')}>العربية</div>
            <div className={`language-name ${pageLanguage === 'hk' ? 'language-checked' : ''}`} onClick={() => projectLanguageChange('hk')}>HK</div>
        </div>
    )
}
export default Language