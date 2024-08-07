import React, { useState } from "react"
import "./regenerateBtn.scss"
import { useTranslation } from 'react-i18next'

const RegenerateBtn = ({ type, clickFn }) => {
    const [property, setProperty] = useState('default')
    const { t } = useTranslation()


    return (
        <div
            className={ ["stop-generating", property].join(' ')}
            onMouseLeave={() => {
                setProperty('default')
            }}
            onMouseEnter={() => {
                setProperty('hover')
            }}
            onClick={() => {
                clickFn()
            }}
        >
            {type === "stop" && (
                <div className="regenerate">
                    <img alt="Union" src="/img/union-1.svg" className="union"></img>
                </div>
            )}
            {["regenerate-response", "regenerate"].includes(type) && (
                <Regenerate1></Regenerate1>
            )}
            <div className="div">
                {type === "stop" && "Stop generating"}
                {type === "regenerate" && "Regenerate"}
                {type === "regenerate-response" && t("content.regenerateResponse")}
            </div>
        </div>
    )

}

const Regenerate1 = () => {
    return <svg
        className="regenerate"
        fill="none"
        height="16"
        viewBox="0 0 17 16"
        width="17"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
        d="M12.6083 3.90589C11.5575 2.85146 10.1054 2.2 8.5 2.2C5.29672 2.2 2.7 4.79675 2.7 8C2.7 11.2033 5.29672 13.8 8.5 13.8C11.7032 13.8 14.3 11.2033 14.3 8C14.3 7.66864 14.5686 7.4 14.9 7.4C15.2314 7.4 15.5 7.66864 15.5 8C15.5 11.866 12.366 15 8.5 15C4.634 15 1.5 11.866 1.5 8C1.5 4.13401 4.634 1 8.5 1C10.4372 1 12.1915 1.7877 13.4583 3.05882C13.4787 3.07925 13.4972 3.10078 13.514 3.12321L14.5201 2.11716C14.6298 2.00741 14.7932 1.97106 14.9391 2.02389C15.085 2.07673 15.1872 2.20922 15.2013 2.36378L15.4841 5.47506C15.4949 5.59328 15.4526 5.71017 15.3686 5.79411C15.2847 5.87806 15.1678 5.92038 15.0496 5.90963L11.9383 5.62679C11.7837 5.61273 11.6512 5.51054 11.5984 5.3646C11.5456 5.21866 11.5819 5.05533 11.6917 4.94559L12.6742 3.96309C12.6512 3.94588 12.6292 3.92682 12.6083 3.90589Z"
        fill="black"
        fillOpacity="0.88"
        className="path"
        ></path>
    </svg>
}

export default RegenerateBtn