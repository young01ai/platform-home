

import { Select } from 'antd'
import React, { useEffect } from 'react'
import { useContext, useState } from 'react'
import { PlaygroundContext, PlaygroundDispatchContext } from '../playgroundContext'
import { getModels } from '@/api/playground'

const getSelect = (options, bindKey) => {
  const SelectComponent = () => {
    const playgroundContext = useContext(PlaygroundContext)
    const dispatch = useContext(PlaygroundDispatchContext)
    return (<Select
      style={{ width:'100%' }}
      value={playgroundContext[bindKey]}
      showSearch
      optionFilterProp="children"
      onChange={(val) => {
          dispatch({
              type: 'change',
              key: bindKey,
              value: val,
          })
      }}
      // onSearch={onSearch}
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      options={options}
    />)
  }

  return SelectComponent
}

const getTagSelect = (options, bindKey) => {
  const SelectComponent = () => {
    const playgroundContext = useContext(PlaygroundContext)
    const dispatch = useContext(PlaygroundDispatchContext)
    return (<Select
      style={{ width: '100%' }}
      value={playgroundContext[bindKey]}
      mode="tags"
      onChange={(val) => {
          dispatch({
              type: 'change',
              key: bindKey,
              value: val,
          })
      }}
      options={options}
    />)
  }

  return SelectComponent
}

const StopSelect = getTagSelect([], 'stop')



const getPromptSelect = (options, map) => {
  const SelectComponent = () => {
    const [config, setConfig ] = useState('')
    const dispatch = useContext(PlaygroundDispatchContext)
    return (<Select
      style={{ width: 288, maxWidth:'100%', textAlign: 'left' }}
      showSearch
      optionFilterProp="children"
      placeholder="加载prompt配置"
      value={config}
      onChange={(val) => {
        console.log(config, setConfig)
        setConfig(val)
        dispatch({
            type: 'setPromptConfig',
            value: map[val] || {},
        })
      }}
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      options={options}
    />)
  }

  return SelectComponent
}
const PromptSelect = getPromptSelect([
  {
    value: 'text-davinci-003',
  },
  {
    value: 'gpt4',
  }
], {
  'text-davinci-003': {
    "temperature": 0.6,
    "top_p": 0.3,
    "frequency_penalty": 1,
    "presence_penalty": 0.5,
  },
  'gpt4': {
    "temperature": 0.2,
    "top_p": 0.4,
    "frequency_penalty": 0.1,
    "presence_penalty": 0.4,
  }
})


const ModelSelect = () => {
  const playgroundContext = useContext(PlaygroundContext)
  const dispatch = useContext(PlaygroundDispatchContext)

  const [list, setList] = useState([])

  useEffect(() => {
    getModels(new URLSearchParams(window.location.search).get('full')).then(res => {
      if(res.data){
        setList(res.data)

        // 默认值
        if(playgroundContext['model'] === '' && res.data[0]){
          // console.log(res.data[0])
          dispatch({
              type: 'change',
              key: 'model',
              value: res.data[0].id,
          })
        }
      }
    })
  }, [])
  
  return (<Select
    style={{ width:'100%' }}
    value={playgroundContext['model']}
    showSearch
    optionFilterProp="children"
    virtual={false}
    popupClassName="auto-width-popup"
    onChange={(val) => {
        dispatch({
            type: 'change',
            key: 'model',
            value: val,
        })
    }}
    // onSearch={onSearch}
    filterOption={(input, option) =>
      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
    }
    fieldNames={{
      label: 'id',
      value: 'id'
    }}
    options={list}
  />)
}

export { ModelSelect, StopSelect, PromptSelect, getSelect }