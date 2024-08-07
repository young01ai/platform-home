import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { getUploadUrl } from '@/api/chat'
import './index.scss'
import { useTranslation } from 'react-i18next'

const FileUpload = ({
    handleUploaded,
    handleUploading,
}, ref) => {
    const { t } = useTranslation()

    const uploadRef = useRef(null)
    const promiseArrayRef = useRef([])

    const [iconList, setIconList] = useState([])
    const [fileList, setFileList] = useState([])
    const [previewVisible, setPreviewVisible] = useState(false)
    const [curImg, setCurImg] = useState('')


    const clear = () => {
        setIconList([])
        setFileList([])
        promiseArrayRef.current = []
        uploadRef.current.value = null
        handleUploaded && handleUploaded(null)
    }

    const uploadFile = (url, fullPath, file, index) => {
        // console.log('!!!!!')
        return fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': ''
        },
        body: file,
        }).then(res => {
            console.log('!!!!!', res)
            if (res.status === 200) {
                //   console.log('文件上传成功！')
                setIconList((val) => {
                    val[index] = fullPath
                    return [...val]
                })
                return fullPath
            }
            else {
                console.error(t('interface.uploadFailed') /**上传失败 */)
                setIconList((val) => {
                    val[index] = 'error'
                    return [...val]
                })
                return false
            }
        }).catch(e => {
            console.error(t('interface.uploadFailed') /**上传失败 */)
            setIconList((val) => {
                val[index] = 'error'
                return [...val]
            })
            return false
        })
    }

    const handleFileSelect = (file, index) => {
        return getUploadUrl(encodeURIComponent(file.name)).then((res) => {
            console.log('asdfasdf', res)
            if (res.status === 0) {
                const data = res.data
                // const realUrl = data.signedUrl.replaceAll('&', '%26')
                const realUrl = data.signedUrl
                console.log(realUrl)
                return uploadFile(realUrl, data.fullImagePath, file, index)
            }
            else {
                console.error(t('interface.uploadLinkFailed') /**获取上传链接失败 */)
                setIconList((val) => {
                    val[index] = 'error'
                    return [...val]
                })
                // clear()
            }
        }).catch(e => {
            console.error(t('interface.uploadLinkFailed') /**获取上传链接失败 */)
            setIconList((val) => {
                val[index] = 'error'
                return [...val]
            })
            // clear()
        })
    }

    useEffect(() => {

    }, [])

    useImperativeHandle(ref, () => ({
        showUpload: () => {
            uploadRef.current.click()
        },
        clear: () => {
            clear()
        }
    }))

    return <div className="file-upload-container">
        <input ref={uploadRef} className='file-upload-input' accept="image/*" type="file" multiple onChange={(e) => {
            // console.log(e)

            const fileListCur = Array.from(e.target.files)
            setFileList(fileList.concat(fileListCur))
            // console.log('fileList', fileList)
            handleUploading && handleUploading(true)
            promiseArrayRef.current = promiseArrayRef.current.concat(
                fileListCur.map((v, index) => {{
                    return handleFileSelect(v, fileList.length + index)
                }})
            ) 

            // eslint-disable-next-line no-undef
            Promise.all(promiseArrayRef.current).then(res => {
                console.log('iconList', iconList, res)
                handleUploaded && handleUploaded(res)
            })
            
        }} />

        {fileList.map((v, fileIndex) => {
            const icon = iconList[fileIndex]
            if (icon) {
                return <div className="upload-img-item-wrapper" key={fileIndex}>
                    <img
                        onClick={() => {
                            setCurImg(icon)
                            setPreviewVisible(true)
                        }}
                        className="file-upload-icon" src={icon} />
                    <div className="upload-img-delete" onClick={() => {
                        fileList.splice(fileIndex, 1)
                        iconList.splice(fileIndex, 1)
                        setFileList([...fileList])
                        setIconList([...iconList])
                        promiseArrayRef.current.splice(fileIndex, 1)
                        // eslint-disable-next-line no-undef
                        Promise.all(promiseArrayRef.current).then(res => {
                            console.log('iconList', iconList, res)
                            handleUploaded && handleUploaded(res)
                        })
                        if(fileList.length === 0){
                            clear()
                        }
                    }}>✕</div>
                </div>
            } else {
                return <div key={fileIndex} className="file-uploading">{t('content.uploading') /**文件上传中... */}</div>
            }
        })}

        <div className='y-modal' hidden={!previewVisible} onClick={() => {
            setPreviewVisible(false)
        }}>
            <img src={curImg} />
        </div>
    </div>
}

export default forwardRef(FileUpload)