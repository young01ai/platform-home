'use client'

import dynamic from 'next/dynamic'

const MyClientComponent = dynamic(() => import("./MyWebRTC"), {
  // Do not import in server side
  ssr: false,
})

export default function MyClient() {
  return (
    <div className='webrtc-demo'>
      <MyClientComponent />
    </div>
  )
}