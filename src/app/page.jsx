'use client'

import './home.scss'

// import Link from 'next/link'
import React, { useEffect } from 'react'
import dynamic from "next/dynamic"

import Analytics from '@/util/awsReport'

import PlatformLayout from './platformLayout'

const ParticlesBg = dynamic(() => import("particles-bg"), {
  // Do not import in server side
  ssr: false,
})

function Index() {
  useEffect(() => {
    Analytics.record({
      name: 'homeShow'
    })
  }, [])
  return (
      <div className="root-home-page">
        <div className="home-page">
          <div className="home-content">
            <div className="home-video">
            </div>
            <ParticlesBg color="#ffffff" type="cobweb" bg={true} num={88}/>
            <div className="home-inner">
              <div className="text-left inline-block">
                <div className="inner-card">零一万物 大模型平台</div>
                <div className="inner-bottom">
                  <span>
                    提升工作效率，创造更多价值，让每个人都享受高效、有趣、充实的科技生活</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}


export default function Home() {
  return <PlatformLayout>
    <Index></Index>
  </PlatformLayout>
}


