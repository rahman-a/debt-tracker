import { useEffect, useState, useRef } from 'react'
import { useChatContext } from 'stream-chat-react'
import style from './style.module.scss'
import { Paperclip, ImagePlaceholder, FilePlaceholder } from '@/src/icons'
import CropModal from '@/src/components/CropImage/CropModal'

// eslint-disable-next-line react/prop-types
const Upload = ({ isFile, setIsFile }) => {
  const [isImageCrop, setIsImageCrop] = useState(false)
  const [imageCropData, setImageCropData] = useState(null)
  const { channel } = useChatContext()
  const fileRef = useRef(null)
  const containerFileRef = useRef(null)

  const uploadImageHandler = async (e) => {
    const file = e.target.files[0]
    if (file.size > 2000000) {
      return
    }
    const url = URL.createObjectURL(file)
    setImageCropData({ url, file })
    setIsImageCrop(true)
    setIsFile(false)
  }

  const uploadDocumentHandler = async (e) => {
    const file = e.target.files[0]
    if (file.size > 2000000) {
      return
    }
    const fileResponse = await channel.sendFile(file)
    await channel.sendMessage({
      text: '',
      attachments: [
        {
          type: 'file',
          title: file.name,
          asset_url: fileResponse.file,
          file_size: file.size,
          mime_type: file.type,
          fallback: 'File',
        },
      ],
    })
    setIsFile(false)
  }

  const sendImageAfterCropHandler = async (file) => {
    const imageResponse = await channel.sendImage(file)
    await channel.sendMessage({
      text: '',
      attachments: [
        {
          type: 'image',
          image_url: imageResponse.file,
          fallback: 'Image',
        },
      ],
    })
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        fileRef.current &&
        !fileRef.current.contains(event.target) &&
        containerFileRef.current &&
        !containerFileRef.current.contains(event.target)
      ) {
        setIsFile(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <>
      <CropModal
        isCropPhoto={isImageCrop}
        defaultSrc={imageCropData?.url}
        file={imageCropData?.file}
        closePanel={() => setIsImageCrop(false)}
        output={(file) => sendImageAfterCropHandler(file)}
        title='edit-image'
      />
      <div style={{ position: 'relative' }}>
        <span ref={fileRef} onClick={() => setIsFile((prev) => !prev)}>
          <Paperclip />
        </span>
        {isFile && (
          <div ref={containerFileRef} className={style.input__messages_upload}>
            <label htmlFor='image-upload' title='upload image'>
              <ImagePlaceholder />
            </label>
            <label htmlFor='document-upload' title='upload file'>
              <FilePlaceholder />
            </label>
          </div>
        )}
        <div className={style.input__messages_input}>
          <input
            onChange={uploadImageHandler}
            accept='.png,.PNG,.jpg,.jpeg,.JPG'
            id='image-upload'
            type='file'
            name='attachment'
            style={{ display: 'none' }}
          />
          <input
            onChange={uploadDocumentHandler}
            accept='.pdf,.doc,.docx,.pptx,.xlsx,.txt'
            id='document-upload'
            type='file'
            name='attachment'
            style={{ display: 'none' }}
          />
        </div>
      </div>
    </>
  )
}

export default Upload
