

import { useState, useContext, useMemo, useRef } from 'react'
import { Drawer, Button, Input } from 'antd'
import Icon from '@ant-design/icons'
import { store } from '@/util/store'
import { PlaygroundDispatchContext } from '../playgroundContext'
import History from '@/components/IconY/history.svg'
import TrashSvg from '@/components/IconY/trash.svg'
import EditSvg from '@/components/IconY/edit.svg'
import ChatSvg from '@/components/IconY/chat.svg'
import './HistoryDrawer.scss'

import { useTranslation } from 'react-i18next'

const HistoryDrawer = ({
    setMessage
}) => {

    const { t } = useTranslation()

    const [historyConfig, setHistoryConfig] = useState([])
    const [open, setOpen] = useState(false)
    const [selectIndex, setSelectIndex] = useState(0)
    const [editIndex, setEditIndex] = useState(null)

    const inputRef = useRef(null)

    const dispatch = useContext(PlaygroundDispatchContext)

    const historyConfigItems = useMemo(() => {
        return historyConfig.map((v, i) => {
            return <div key={i} className="history-item" data-selected={i === selectIndex} onClick={() => {
                setSelectIndex(i)
                dispatch({ type: 'setPromptConfig', value: v })
                setMessage && setMessage(v.messages)
            }}>
                <Icon className="y-icon y-icon-chat" component={ChatSvg}></Icon>
                {editIndex !== i ? <h3 className="history-item-title">{v.title}</h3> : <Input ref={inputRef} className="history-item-title" defaultValue={v.title} onBlur={(e, v) => {
                    // console.log(e.target.value)
                    setHistoryConfig((val) => {
                        const historyConfig = val.map((v, index) => {
                            if(index === editIndex){
                                return {
                                    ...v,
                                    title: e.target.value
                                }
                            }
                            return v
                        })
                        store.set('history-config-01', historyConfig)
                        // console.log(selectIndex, editIndex)
                        if(selectIndex === editIndex) {
                            dispatch({
                                type: 'change',
                                key: 'title',
                                value: e.target.value
                            })
                    }
                        return historyConfig
                    })
                    setEditIndex(null)
                }}
                onClick={(e) => {
                    e.stopPropagation()
                }}
                ></Input>}
                
                <div className="history-item-opt">
                    <Icon className="y-icon y-icon-edit" component={EditSvg} onClick={(e) => {
                        e.stopPropagation()
                        setEditIndex(i)
                        setTimeout(() => {
                            inputRef.current.focus({
                                cursor: 'start',
                            }) 
                        }, 0)
                    }}></Icon>
                    <Icon className="y-icon y-icon-trash" component={TrashSvg} onClick={(e) => {
                        e.stopPropagation()
                        historyConfig.splice(i, 1)
                        setHistoryConfig([...historyConfig])
                        store.set('history-config-01', historyConfig)
                    }}></Icon>
                </div>
            </div>
        })
    }, [historyConfig, selectIndex, editIndex])

    return <div className="history-drawer-container">
        <Drawer className="history-drawer" title={t('pageMain.history')} placement="left" onClose={() => {
            setOpen(false)
        }} open={open}
        width={368}
        >
            {historyConfigItems}
        </Drawer>
        <Icon className="y-icon y-icon-history" component={History} onClick={() => {
            const storedHistoryConfig = store.get('history-config-01', true)
            console.log('storedHistoryConfig', storedHistoryConfig)
            if (storedHistoryConfig) {
                setHistoryConfig(storedHistoryConfig)
            }
            setOpen(true)
        }}></Icon>
    </div>
}

export default HistoryDrawer