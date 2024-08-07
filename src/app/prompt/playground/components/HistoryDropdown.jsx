

import  {useState, useContext, useMemo} from 'react'
import { Dropdown, Button } from 'antd'
import Icon, { HeartOutlined, HeartFilled } from '@ant-design/icons'
import { store } from '@/util/store'
import { timeago } from '@/util/yUtil'
import { PlaygroundDispatchContext } from '../playgroundContext'
import History from '@/components/IconY/history.svg'

const savedConfigTitle = [{
    label: <div className="history-dropdown-item">
      <h3 className="dropdown-item-title-h3">Favorate(Valid for one month locally)</h3>
    </div>,
    disabled: true
}]
  
const historyConfigTitle = [{
    label: <div className="history-dropdown-item">
      <h3 className="dropdown-item-title-h3">History(Latest one hundred messages)</h3>
    </div>,
    disabled: true
}]

const HistoryDropdown = ({
    setMessage
}) => {
    const [savedConfig, setSavedConfig] = useState([])
    const [historyConfig, setHistoryConfig] = useState([])

    const dispatch = useContext(PlaygroundDispatchContext)

    const savedConfigItems = useMemo(() => {
        return savedConfig.map((v, i) => {
            return {
                label: <div className="history-dropdown-item" onClick={() => {
                    dispatch({ type: 'setPromptConfig', value: v })
                    setMessage && setMessage(v.messages)
                }}>
                  
                  <div className="dropdown-item-content">
                    <h3 className="dropdown-item-title">{v.title}(含{v.messages.length}条消息)</h3>
                    <div className="dropdown-item-desc">{timeago(v.updateTime)}</div>
                  </div>
                  <Button 
                    className="love-btn" 
                    type="text" icon={<HeartFilled />}
                    onClick={(e) => {
                        e.stopPropagation()
                        const tmp = savedConfig.splice(i, 1)
                        setHistoryConfig((val) => {
                            const newHistory = [ {
                                ...tmp[0],
                                updateTime: new Date().getTime()
                            }, ...val]
                            store.set('history-config-01', newHistory)
                            return newHistory
                        })
                        setSavedConfig([...savedConfig])
                        store.set('saved-config', savedConfig)
                    }}
                    ></Button>
                </div>
            }
        })
    }, [savedConfig])
    const historyConfigItems = useMemo(() => {
        return historyConfig.map((v, i) => {
            return {
                label: <div className="history-dropdown-item" onClick={() => {
                    dispatch({ type: 'setPromptConfig', value: v })
                    setMessage && setMessage(v.messages)
                }}>
                  <div className="dropdown-item-content">
                    <h3 className="dropdown-item-title">{v.title}(Includes {v.messages.length} messages)</h3>
                    <div className="dropdown-item-desc">{timeago(v.updateTime)}</div>
                  </div>
                  <Button 
                    className="love-btn" 
                    type="text" icon={<HeartOutlined />}
                    onClick={(e) => {
                        e.stopPropagation()
                        const tmp = historyConfig.splice(i, 1)
                        setSavedConfig((val) => {
                            const newSaved = [ {
                                ...tmp[0],
                                updateTime: new Date().getTime()
                            }, ...val]
                            store.set('saved-config', newSaved)
                            return newSaved
                        })
                        setHistoryConfig([...historyConfig])
                        store.set('history-config-01', historyConfig)
                    }}
                    ></Button>
                </div>
            }
        })
    }, [historyConfig])

    return <Dropdown autoAdjustOverflow trigger={['click']} overlayClassName="history-dropdown" menu={{
        items: savedConfigTitle.concat(savedConfigItems).concat(historyConfigTitle).concat(historyConfigItems)
    }}>
    <Button className="mr12"  type="text" icon={<Icon className="y-icon y-icon-history" component={History}></Icon>} onClick={() => {
        const storedHistoryConfig = store.get('history-config-01', true)
        const storedsavedConfig = store.get('saved-config', true)
        // console.log('storedHistoryConfig', storedHistoryConfig)
        if(storedHistoryConfig){
            setHistoryConfig(storedHistoryConfig)
        }
        if(storedsavedConfig){
            setSavedConfig(storedsavedConfig)
        }
    }}></Button>
    </Dropdown>
}

export default HistoryDropdown