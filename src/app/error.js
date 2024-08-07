'use client' // Error components must be Client Components
 
import { useEffect } from 'react'
import Analytics from '@/util/awsReport'
 
export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    // console.log({ error })
    Analytics.record({
        name: 'exception',
        attributes: {
          error: error?.message
        }
    })
  }, [error])
 
  return (
    <div>
      <h2>Something went wrong!</h2>
      <h3>It seems like you are using an outdated browser version. Please consider upgrading your browser to the latest version for a better experience and improved security.</h3>
      <p>{error?.message}</p>
      <p>{error?.stack}</p>
    </div>
  )
}