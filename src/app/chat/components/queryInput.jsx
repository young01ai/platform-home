import { useState, useRef, forwardRef, useImperativeHandle } from 'react'
import { useTranslation } from 'react-i18next'

const QueryInput = ({
    pressEnter,
    uploadFile
}, ref) => {
    const { t } = useTranslation()
    const inputRef = useRef()
    const [query, setQuery] = useState('')

    useImperativeHandle(ref, () => ({
        getQuery: () => {
            return query.trim()
        },
        setQuery,
        clear: () => {
            setQuery('')
            inputRef.current.style.height = 'auto'
        }
    }))

    const disabled = (() => {
      if(uploadFile){
        return false
      } else {
        if(query.trim() !== ''){
          return false
        }
        return true
      }
    }) 

  return <>
    <textarea className="textarea" ref={inputRef} value={query}
      placeholder={`${t('content.sendMessage')}`} /**发信息... */
      rows={1}
      onInput={e => {
        const element = e.target
        element.style.height = "5px"
        element.style.height = (element.scrollHeight) + "px"
        const realVal = element.value
        setQuery(realVal)
      }} onKeyDown={(e) => {
        if (e.code === 'Enter' & !e.shiftKey) {
          e.preventDefault()
          // console.log(e)
          // 检查是否在使用输入法编辑器
          if (e.nativeEvent.isComposing) {
            // 用户可能正在使用输入法编辑器，不执行后续操作
            return
          } else {
            pressEnter()
          }

        }
      }}
    ></textarea>
    <button
      onClick={e => { 
        pressEnter()
      }}
      className="send-btn"
      disabled={disabled()}
    >
      <svg className="send-btn-img" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="send">
          <path id="Icon" d="M4.00035 7.99998L2.17969 2.08398C6.53489 3.35043 10.6419 5.35118 14.3237 7.99998C10.6422 10.6492 6.53541 12.6504 2.18035 13.9173L4.00035 7.99998ZM4.00035 7.99998H9.00035" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </button>
  </>
}

export default forwardRef(QueryInput)