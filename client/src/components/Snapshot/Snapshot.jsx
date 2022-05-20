import React, { useState, useCallback, useRef, useEffect } from 'react'
import style from './style.module.scss'
import Webcam from 'react-webcam'
import { v4 as uuidv4 } from 'uuid'
import { useSelector, useDispatch } from 'react-redux'
import { Alert } from 'react-bootstrap'
import actions from '../../actions'
import { Loader, FormStepsChanger } from '../../components'
import { useTranslation } from 'react-i18next'

const VerificationSnapshot = ({ step, setStep, info }) => {
  const [imgSrc, setImgSrc] = useState('')
  const [isTaken, setIsTaken] = useState(false)
  const [snapshot, setSnapshot] = useState(null)
  const [mediaError, setMediaError] = useState(null)
  const webcamRef = useRef(null)
  const dispatch = useDispatch()
  const { loading, error, success } = useSelector((state) => state.registerUser)
  const { t } = useTranslation()

  const takeVerificationPhotoHandler = useCallback(() => {
    if (!mediaError) {
      const src = webcamRef.current.getScreenshot()
      fetch(src)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], 'verificationImage.png', {
            type: 'image/png',
          })
          setSnapshot(file)
          setImgSrc(src)
          setIsTaken(true)
        })
    }
  }, [webcamRef, setImgSrc, mediaError])

  const uploadDocumentsHandler = (_) => {
    const data = new FormData()
    for (let key in info) {
      if (
        key === 'emails' ||
        key === 'country' ||
        key === 'insidePhones' ||
        key === 'outsidePhones' ||
        key === 'expireAt'
      ) {
        data.append(key, JSON.stringify(info[key]))
      } else data.append(key, info[key])
    }
    data.append('verificationImage', snapshot)
    dispatch(actions.users.registerUser(data))
  }

  const mediaErrorHandler = (error) => {
    setMediaError(error.message)
  }

  const getVideoConstraints = (constraints) => {
    return {
      width: 415,
      height: 300,
      facingMode: 'user',
      ...constraints,
    }
  }

  useEffect(() => {
    error && window.scrollTo(0, 0)
    success && setStep(7)
  }, [error, success])

  return (
    <div className={style.snapshot}>
      {error && <Alert variant='danger'>{error}</Alert>}
      <h3>{t('snapshot-instruction-1')}</h3>
      <p>{t('snapshot-instruction-2')}</p>
      {/* <button onClick={accessCameraHandler}>
                <span></span>
                <p>Click to open the camera</p>
            </button> */}
      <div className={style.snapshot__photo}>
        {/* <span className={style.snapshot__skip} onClick={() => setStep(7)}>
          skip this step
        </span> */}
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
        {mediaError && (
          <>
            <h3>{mediaError}</h3>
            <h3>{t('enable-access')}</h3>
          </>
        )}
        <button disabled={mediaError} onClick={takeVerificationPhotoHandler}>
          {isTaken ? t('take-snapshot-again') : t('take-snapshot')}
        </button>
        {imgSrc && <img src={imgSrc} alt='verification' />}
        <button
          disabled={!isTaken}
          onClick={uploadDocumentsHandler}
          style={{
            position: 'relative',
            color: '#1A374D',
          }}
        >
          {loading ? (
            <Loader size='4' center options={{ animation: 'border' }} />
          ) : (
            t('finish-registration')
          )}
        </button>
      </div>
      <FormStepsChanger step={step} setStep={setStep} />
    </div>
  )
}

export default VerificationSnapshot
