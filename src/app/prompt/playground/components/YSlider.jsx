import './YSlider.scss'

import { Slider, InputNumber } from 'antd'
import React from 'react'
import { useContext } from 'react'
import { PlaygroundContext, PlaygroundDispatchContext } from '../playgroundContext'

const getSlider = (bindKey, options) => {
    const SliderComponent = () => {
        const playgroundContext = useContext(PlaygroundContext)
        const dispatch = useContext(PlaygroundDispatchContext)

        // console.log('SliderComponent render', bindKey, playgroundContext)
        return (<div className="playground-slider">
            <InputNumber className="playground-slider-input"
                onChange={(val) => {
                    dispatch({
                        type: 'change',
                        key: bindKey,
                        value: val,
                    })
                }}
                bordered={false}
                value={playgroundContext[bindKey]}
                min={options.min || 0}
                max={options.max}
                step={options.step}
                precision={options.precision}
            ></InputNumber>
            <Slider
                min={options.min || 0}
                max={options.max}
                step={options.step}
                tooltip={{ formatter: null }}
                onChange={(val) => {
                    dispatch({
                        type: 'change',
                        key: bindKey,
                        value: val,
                    })
                }}
                value={playgroundContext[bindKey]}
            />
        </div>)
    }

    return SliderComponent
}

const TemperatureSlider = getSlider('temperature', {
    min: 0,
    max: 2,
    step: 0.01,
    precision: 2
})

const MaxTokensSlider = getSlider('max_tokens', {
    min: 1,
    max: 4096,
    step: 1,
    precision: 0
})

const TopPSlider = getSlider('top_p', {
    min: 0,
    max: 1,
    step: 0.01,
    precision: 2
})

const FrequencySlider = getSlider('frequency_penalty', {
    min: 0,
    max: 2,
    step: 0.01,
    precision: 2
})

const PresenceSlider = getSlider('presence_penalty', {
    min: 0,
    max: 2,
    step: 0.01,
    precision: 2
})

const BestofSlider = getSlider('best_of', {
    min: 1,
    max: 20,
    step: 1,
    precision: 0
})

export { TemperatureSlider, MaxTokensSlider, TopPSlider, FrequencySlider, PresenceSlider, BestofSlider }