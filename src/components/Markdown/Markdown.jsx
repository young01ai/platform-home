import ReactMarkdown from 'react-markdown'
import 'katex/dist/katex.min.css'
import RemarkMath from 'remark-math'
import RemarkBreaks from 'remark-breaks'
import RehypeKatex from 'rehype-katex'
import RemarkGfm from 'remark-gfm'
import RemarkEmoji from 'remark-emoji'
import RemarkImages from 'remark-images'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { copyTextToClipboard } from '@/util/yUtil'
import { message } from 'antd'

import IconButton from '@/components/IconButton'

import './github-markdown.scss'
import './Markdown.scss'


// katex公式替换正则
// const regex = /\\\((.*?)\\\)/g
const regex = /(?<!```[\s\S]*?)\\\(\s*(.*?)\s*\\\)(?![\s\S]*?```)/g
const regex1 = /(?<!```[\s\S]*?)\\\[\s*(.*?)\s*\\\](?![\s\S]*?```)/g
// const regex1 = /\\\[(.*?)\\\]/g



export default function Markdown(props) {
  let text = props.content
    if(regex.test(text)){
      text = text
        .replaceAll(regex, String.raw`$ $1 $`)
        // console.log(text)
    }
  
    if(regex1.test(text)){
      text = text
        .replaceAll(regex1, `$$$$ $1 $$$$`)
        // console.log(text)
    }
  
  
  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[RemarkMath,RemarkGfm, RemarkBreaks,RemarkEmoji,RemarkImages]}
        rehypePlugins={[
          RehypeKatex,
        ]}
        components={{
          code(props) {
            const {children, className, node, ...rest} = props
            const match = /language-(\w+)/.exec(className || '')
            return match ? (
              <div className="code-container">
                <div className="code-header">
                  <span>{match[1]}</span>
                  <a onClick={() => {
                    copyTextToClipboard(String(children)).then(res => {
                      message.success('')
                    })
                  }}>
                    <IconButton type="copy" hoverType="opacity"></IconButton>
                  </a>
                </div>
                <SyntaxHighlighter
                  {...rest}
                  // eslint-disable-next-line react/no-children-prop
                  children={String(children).replace(/\n$/, '')}
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    padding: 0,
                    backgroundColor: 'transparent'
                  }}
                  language={match[1]}
                />
              </div>
            ) : (
              <code {...rest} className={`no-language-code ${className || ''}`}>
                {children}
              </code>
            )
          },
          a(props) {
            return <a href={props.href} target="_blank">{props.children}</a>
          },
          img(props) {
            // console.log('a', props.src.endsWith('.wav'))
            if(props.src && props.src.endsWith('.wav')){
              return <audio  style={{
                display: 'block',
                margin: '12px 0'
              }} controls src={props.src}></audio>
            }
            return <img style={{
              cursor:  'pointer'
            }} src={props.src} alt={props.alt} onClick={() => {
              window.open(props.src)
            }}></img>
          }
        }}
      >
        {text}
        {/* {props.content} */}
      </ReactMarkdown>
    </div>
  )
}
