import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { getDocUploadUrl } from '@/api/chat'
import './index.scss'
import { useTranslation } from 'react-i18next'

const FileUpload = ({
    handleUploaded,
    handleUploading,
    accept
}, ref) => {
    const { t } = useTranslation()

    const uploadRef = useRef(null)
    const [uploaded, setUploaded] = useState(false)
    const [file, setFile] = useState('')


    const clear = () => {
        setUploaded(false)
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
                setUploaded(true)
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
        getDocUploadUrl(encodeURIComponent(file.name)).then((res) => {
            console.log('asdfasdf', res)
            if (res.status === 0) {
                const data = res.data
                // const realUrl = data.signedUrl.replaceAll('&', '%26')
                const realUrl = data.signedUrl
                console.log(realUrl)
                uploadFile(realUrl, data.docFilePath, file)
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
        <input 
            ref={uploadRef} 
            className='file-upload-input' 
            type="file" 
            accept={accept}
            onChange={(e) => {
            // console.log(e)
            setFile(e.target.files[0])
            // console.log('file', file)
            handleUploading && handleUploading(true)
            handleFileSelect(e)
        }} />
        {uploaded ? <div className="file-uploaded upload-img-item-wrapper" data-accept={accept}>
            <div className="upload-img-delete" onClick={() => {
                clear()
            }}>✕</div>
        </div> :
            file ? <div className="file-uploading">{t('content.uploading') /**文件上传中... */}</div> : null
        }
    </div>
}

export default forwardRef(FileUpload)