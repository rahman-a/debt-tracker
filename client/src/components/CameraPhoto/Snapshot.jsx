import React, { useCallback, useEffect, useRef, useState } from 'react'
import style from './style.module.scss'
import Webcam from 'react-webcam'
import { Button } from 'react-bootstrap'
import { v4 as uuidv4 } from 'uuid'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { Portrait, Crop, User } from '../../icons'

const Snapshot = ({
  uploadFileHandler,
  setIsCropping,
  imgSrc,
  setImgSrc,
  setFile,
  closeCamera,
  isTaken,
  setIsTaken,
}) => {
  const [mediaError, setMediaError] = useState(null)
  const [finalImage, setFinalImage] = useState(null)
  const webcamRef = useRef(null)

  const { t } = useTranslation()
  const lang = i18next.language

  const takeVerificationPhotoHandler = useCallback(() => {
    if (!mediaError) {
      const src = webcamRef.current.getScreenshot()
      fetch(src)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], 'personal_image_selected.png', {
            type: 'image/png',
          })
          setFinalImage(file)
          setFile(file)
          setImgSrc(src)
          setIsTaken(true)
        })
    }
  }, [webcamRef, setImgSrc, mediaError])

  const mediaErrorHandler = (error) => {
    setMediaError(error.message)
  }

  const selectPhotoHandler = () => {
    uploadFileHandler(finalImage, 'avatar')
    closeCamera()
  }

  const getVideoConstraints = (constraints) => {
    return {
      width: 415,
      height: 300,
      facingMode: 'user',
      ...constraints,
    }
  }

  return (
    <>
      <div className={style.snapshot__images}>
        <div
          className={`${style.snapshot__image} ${
            mediaError ? style.snapshot__noImage : ''
          }`}
        >
          {!mediaError && (
            <Webcam
              key={uuidv4()}
              audio={false}
              screenshotFormat='image/png'
              videoConstraints={() => getVideoConstraints({})}
              ref={webcamRef}
              imageSmoothing={true}
              minScreenshotHeight={300}
              minScreenshotWidth={415}
              onUserMediaError={(error) => mediaErrorHandler(error)}
            />
          )}
          {mediaError && (
            <>
              <p>{mediaError}</p>
              <p>{t('enable-access')}</p>
            </>
          )}
        </div>
        <div
          className={`${style.snapshot__image} ${
            !isTaken ? style.snapshot__noImage : ''
          }`}
        >
          {!isTaken && (
            <p>
              <span>
                <Portrait />
              </span>
              {t('photo-appear')}
            </p>
          )}
          {imgSrc && <img src={imgSrc} alt='avatar' />}
        </div>
      </div>
      <div
        className={`${style.snapshot__actions} ${
          lang === 'ar' ? style.snapshot__actions_ar : ''
        }`}
      >
        <Button size='lg' variant='dark' onClick={takeVerificationPhotoHandler}>
          <span>
            <Portrait />
          </span>
          {t('take-photo')}
        </Button>
        {isTaken && (
          <div className={style.snapshot__actions_taken}>
            <Button
              disabled={!isTaken}
              size='lg'
              variant='primary'
              onClick={selectPhotoHandler}
            >
              <span>
                <User />
              </span>
              {t('select-photo')}
            </Button>
            <Button
              disabled={!isTaken}
              size='lg'
              variant='warning'
              onClick={() => setIsCropping(true)}
            >
              <span>
                <Crop />
              </span>
              {t('crop-photo')}
            </Button>
          </div>
        )}
      </div>
    </>
  )
}

export default Snapshot
