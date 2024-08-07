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

    const [icon, setIcon] = useState('')
    const [file, setFile] = useState('')
    const [previewVisible, setPreviewVisible] = useState(false)


    const clear = () => {
        setIcon('')
        setFile('')
        uploadRef.current.value = ''
        handleUploaded && handleUploaded('')
    }

    const uploadFile = (url, fullPath, file) => {
        // console.log('!!!!!')
        fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': ''
        },
        body: file,
        }).then(res => {
            console.log('!!!!!', res)
            if (res.status === 200) {
                //   console.log('文件上传成功！')
                setIcon(fullPath)
                handleUploaded && handleUploaded(fullPath)
            }
            else {
                console.error(t('interface.uploadFailed') /**上传失败 */)
                clear()
            }
        }).catch(e => {
            console.error(t('interface.uploadFailed') /**上传失败 */)
            clear()
        })
    }

    const handleFileSelect = (event) => {
        const file = event.target.files[0]
        getUploadUrl(encodeURIComponent(file.name)).then((res) => {
            console.log('asdfasdf', res)
            if (res.status === 0) {
                const data = res.data
                // const realUrl = data.signedUrl.replaceAll('&', '%26')
                const realUrl = data.signedUrl
                console.log(realUrl)
                uploadFile(realUrl, data.fullImagePath, file)
            }
            else {
                console.error(t('interface.uploadLinkFailed') /**获取上传链接失败 */)
                clear()
            }
        }).catch(e => {
            console.error(t('interface.uploadLinkFailed') /**获取上传链接失败 */)
            clear()
        })
    }

    useEffect(() => {
        // const url = 'https://01-platform-public.oss-cn-beijing.aliyuncs.com/playground/image/50eff4f5-855b-468f-8a5a-0a3e18fb1754-logo.png'
        //       setIcon(url)
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
        <input ref={uploadRef} className='file-upload-input' accept="image/*" type="file" onChange={(e) => {
            // console.log(e)
            setFile(e.target.files[0])
            // console.log('file', file)
            handleUploading && handleUploading(true)
            handleFileSelect(e)

            // setTimeout(() => {
            //   const url = 'https://01-platform-public.oss-cn-beijing.aliyuncs.com/playground/image/50eff4f5-855b-468f-8a5a-0a3e18fb1754-logo.png'
            //   setIcon(url)
            //   handleUploaded(url)
            // }, 800)
        }} />
        {icon ? <div className="upload-img-item-wrapper">
            <img
                onClick={() => {
                    setPreviewVisible(true)
                }}
                className="file-upload-icon" src={icon} />
            <div className="upload-img-delete" onClick={() => {
                clear()
            }}>✕</div>
        </div> :
            file ? <div className="file-uploading">{t('content.uploading') /**文件上传中... */}</div> : null
        }
        <div className='y-modal' hidden={!previewVisible} onClick={() => {
            setPreviewVisible(false)
        }}>
            <img src={icon} />
        </div>
    </div>
}

export default forwardRef(FileUpload)