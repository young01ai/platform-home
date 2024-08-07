'use client'

import { Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { store as localStore } from '@/util/store'
import './modelSelect.scss'
import { getModel } from '@/api/chat'

const ModelSelect = ({ val = '',
    disabled = false,
    full = false,
    onChange = null,
}) => {
    const [modelList, setModelList] = useState([])

    useEffect(()=>{
        getModel(full).then(res => {
            if (res.data) {
                setModelList(res.data.map(v => {
                    return {
                        value: v.id,
                        label: v.id
                    }
                })
                )
            }
        })
    },[full])

    // Filter `option.label` match the user type `input`
    const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())

    return <Select
        className="model-select-container"
        // popupClassName="auto-width-dropdown"
        disabled={disabled}
        value={val}
        showSearch
        filterOption={filterOption}
        optionFilterProp="children"
        onChange={(val) => {
            if (onChange) onChange(val)
            localStore.set('last-select-model', val)
        }}
        options={modelList}
        popupMatchSelectWidth={false}
    />
}

export default ModelSelect