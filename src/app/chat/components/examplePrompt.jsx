'use client'

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const ExamplePrompt = ({
  modelName = "",
  onChoose = null
}) => {
  const { t } = useTranslation()

  return <div className="flex flex-col gap-6">
    <div className="flex flex-col gap-4 py-5 px-4 text-black">
      <div className="text-4xl font-bold">
        {t('prompt.titleLeft')}<span className="text-brand">{modelName}</span>{t('prompt.titleRight')}
      </div>
      <div className="flex flex-col">
        <div className="text-base font-medium" style={{ color: 'var(--brandhover)' }}>
          {t('prompt.welcomeLeft')}{modelName}{t('prompt.welcomeRight')}
        </div>
        <div className="text-desc" style={{color:'var(--gray-88)',marginTop:'4px'}}>
          {t('prompt.welcomeDesc')}
        </div>
      </div>
    </div>
    <ul className="gap-3 ex-container">
      {
        [{
          title: t('prompt.promptOneTitle'),
          prompt: t('prompt.promptOneContent'),
        },
        {
          title: t('prompt.promptTwoTitle'),
          prompt: t('prompt.promptTwoContent'),
        }, {
          title: t('prompt.promptThreeTitle'),
          prompt: t('prompt.promptThreeContent'),
        }
          , {
          title: t('prompt.promptFourTitle'),
          prompt: t('prompt.promptFourContent'),
        }].map(v => (
          <button key={v.prompt} className="flex flex-col p-4 gap-1.5 rounded text-left bg-gray-50"
            onClick={() => onChoose && onChoose(v)}
          >
            <span className="toe-1 text-base font-semibold">{v.title}</span>
            <span className="toe-2 text-sm ar-prompt-text" style={{color:'var(--gray-60)'}}>{v.prompt}</span>
          </button>
        ))
      }
    </ul>
  </div>

}

export default ExamplePrompt