import React, { useState } from 'react'
import style from './style.module.scss'
import { Modal, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { Camera } from '../../icons'
import { CropImage } from '../../components'
import Snapshot from './Snapshot'

const CameraPhoto = ({ isCamera, setIsCamera, uploadFileHandler }) => {
  const [imgSrc, setImgSrc] = useState('')
  const [isCropping, setIsCropping] = useState(false)
  const [isTaken, setIsTaken] = useState(false)
  const [file, setFile] = useState(null)
  const { t } = useTranslation()
  const lang = i18next.language

  // close function
  const close = () => {
    setIsCamera(false)
    setIsTaken(false)
    setIsCropping(false)
    setImgSrc('')
  }

  return (
    <Modal show={isCamera} centered>
      <Modal.Header>
        <Modal.Title>
          <p
            className={`${style.snapshot__title} ${
              lang === 'ar' ? style.snapshot__title_ar : ''
            }`}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <Camera />
            <span>{t('personal-image')}</span>
          </p>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div
          className={`${style.snapshot} ${
            lang === 'ar' ? style.snapshot__ar : ''
          }`}
        >
          {isCropping ? (
            <CropImage
              setIsCropping={setIsCropping}
              defaultSrc={imgSrc}
              file={file}
              closePanel={close}
              outputFile={(output) => uploadFileHandler(output, 'avatar')}
            />
          ) : (
            <Snapshot
              uploadFileHandler={uploadFileHandler}
              isTaken={isTaken}
              setIsTaken={setIsTaken}
              isCropping={isCropping}
              setIsCropping={setIsCropping}
              imgSrc={imgSrc}
              setFile={setFile}
              setImgSrc={setImgSrc}
              closeCamera={close}
            />
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button size='lg' variant='secondary' onClick={close}>
          {t('close')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default CameraPhoto
