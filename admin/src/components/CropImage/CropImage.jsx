import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import { Spinner } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import {
  AngleLeft,
  Crop,
  Close,
  Check,
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  ZoomIn,
  ZoomOut,
} from '../../icons'
import i18next from 'i18next'

const CropImage = ({
  defaultSrc,
  file,
  setIsCropping,
  closePanel,
  outputFile,
}) => {
  const [zoom, setZoom] = useState(0)
  const [rotation, setRotation] = useState(0)
  const [img, setImg] = useState(defaultSrc)
  const [cropper, setCropper] = useState(null)
  const [cropData, setCropData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useTranslation()
  const lang = i18next.language

  const getCropData = () => {
    if (typeof cropper !== 'undefined') {
      setCropData(cropper.getCroppedCanvas().toDataURL())
    }
  }

  useEffect(() => {
    setIsLoading(true)
    const reader = new FileReader()
    reader.onload = () => {
      setImg(reader.result)
      setIsLoading(false)
    }
    reader.readAsDataURL(file)
  }, [file])

  const handleZoom = (value, type) => {
    if (type === 'increase') {
      zoom <= 0.4 && setZoom(zoom + value)
    }
    if (type === 'decrease') {
      zoom >= 0.1 && setZoom(zoom - value)
    }
  }

  const selectFinalPhoto = () => {
    cropper.getCroppedCanvas().toBlob((blob) => {
      outputFile(blob)
      closePanel()
    })
  }

  const handleRotate = (value) => {
    setRotation(value)
  }

  useEffect(() => {
    rotation && cropper?.rotateTo(rotation)
  }, [rotation, cropper])

  useEffect(() => {
    zoom && cropper?.zoom(zoom)
  }, [zoom, cropper])

  return (
    <div className={style.crop}>
      <div className={style.crop__snapshot}>
        {setIsCropping && (
          <button
            className={style.crop__back}
            size='lg'
            variant='light'
            onClick={() => setIsCropping(false)}
          >
            <span>
              <AngleLeft />
            </span>
            {t('back')}
          </button>
        )}
        {cropData ? (
          <div className={style.crop__output}>
            <img crossOrigin='anonymous' src={cropData} alt='avatar' />
          </div>
        ) : isLoading ? (
          <div className={style.crop__loading}>
            <Spinner animation='grow' role='status' variant='dark'>
              <span className='visually-hidden'>Loading...</span>
            </Spinner>
          </div>
        ) : (
          <Cropper
            style={{ height: '100%', width: '100%' }}
            initialAspectRatio={1}
            src={img}
            rotateTo={rotation}
            zoomTo={zoom}
            viewMode={1}
            movable={true}
            background={false}
            responsive={true}
            dragMode={'move'}
            checkOrientation={true}
            onInitialized={(instance) => {
              setCropper(instance)
            }}
            guides={true}
          />
        )}
      </div>
      <div className={style.crop__actions}>
        <div className={style.crop__adjustment}>
          <div
            className={`${style.crop__action} ${
              lang === 'ar' ? style.crop__action_ar : ''
            }`}
          >
            <button disabled={Boolean(cropData)} onClick={getCropData}>
              <span>
                <Crop />
              </span>
              {t('crop')}
            </button>
          </div>
          <div className={style.crop__zoom}>
            <button
              disabled={Boolean(cropData)}
              onClick={() => handleZoom(0.1, 'increase')}
            >
              <span>
                <ZoomIn />
              </span>
            </button>
            <button
              disabled={Boolean(cropData)}
              onClick={() => handleZoom(0.1, 'decrease')}
            >
              <span>
                <ZoomOut />
              </span>
            </button>
          </div>
          <div className={style.crop__rotation}>
            <button
              disabled={Boolean(cropData)}
              onClick={() => handleRotate(360)}
            >
              <span>
                <ArrowUp />
              </span>
            </button>
            <button
              disabled={Boolean(cropData)}
              onClick={() => handleRotate(-90)}
            >
              <span>
                <ArrowLeft />
              </span>
            </button>
            <button
              disabled={Boolean(cropData)}
              onClick={() => handleRotate(180)}
            >
              <span>
                <ArrowDown />
              </span>
            </button>
            <button
              disabled={Boolean(cropData)}
              onClick={() => handleRotate(90)}
            >
              <span>
                <ArrowRight />
              </span>
            </button>
          </div>
        </div>
        <div
          className={`${style.crop__result} ${
            lang === 'ar' ? style.crop__result_ar : ''
          }`}
        >
          {cropData && (
            <>
              <button
                className={style.crop__result_cancel}
                onClick={() => setCropData(null)}
              >
                <span>
                  <Close />
                </span>
                {t('cancel')}
              </button>
              <button
                className={style.crop__result_select}
                onClick={selectFinalPhoto}
              >
                <span>
                  <Check />
                </span>
                {t('select-photo')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

//
export default CropImage
