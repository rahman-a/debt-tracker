import React, { useState, useEffect } from 'react'
import style from './style.module.scss'
import { Alert } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import actions from '../../actions'
import constants from '../../constants'
import {
  Input,
  Button,
  DateInput,
  FormStepsChanger,
  CameraPhoto,
  CropModal,
} from '../../components'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { AddressCard, Camera } from '../../icons'
import Preview from './Preview'
import Thumbnails from './Thumbnails'

const Documents = ({ step, setStep, setInfo, info }) => {
  const [errors, setErrors] = useState(null)
  const [images, setImages] = useState({
    avatar: null,
    'identity-front': null,
    'identity-back': null,
    passport: null,
  })

  const [files, setFiles] = useState({
    avatar: 'browse-device',
    'identity-front': 'identity-image-front',
    'identity-back': 'identity-image-back',
    passport: 'passport-image',
  })

  const [dateValue, setDateValue] = useState({
    identity: null,
    passport: null,
  })

  const dispatch = useDispatch()
  const [expireAt, setExpiryAt] = useState({})
  const [isCamera, setIsCamera] = useState(false)
  const [isCropPhoto, setIsCropPhoto] = useState(false)
  const [imgData, setImgData] = useState(null)
  const [thumbnail, setThumbnail] = useState(null)
  const [previewSrc, setPreviewSrc] = useState(null)
  const { loading, error, success } = useSelector((state) => state.registerUser)
  const { t } = useTranslation()
  const lang = i18next.language

  const uploadFileHandler = (file, name) => {
    let fileName = name
    if (fileName.length > 20) {
      fileName = fileName.substr(0, 20) + '...'
    }
    setFiles({ ...files, [name]: `cropped-${fileName}` })
    setImages({ ...images, [name]: file })
    setImgData(null)
  }

  const getExpiryDate = (name, value) => {
    setExpiryAt({ ...expireAt, [name]: value })
  }

  const initiateEditImage = (e) => {
    const fileSize = e.target.files[0].size
    if (fileSize > 2000000) {
      setErrors(
        t('allowed-file-size', { size: lang === 'en' ? '2MB' : '2 ميجابايت' })
      )
      return
    }
    const url = URL.createObjectURL(e.target.files[0])
    setImgData({ url, file: e.target.files[0], name: e.target.name })
  }

  const moveNextHandler = (_) => {
    if (!images.avatar) {
      setErrors(t('provide-personal-image'))
      return
    }
    if (!images['identity-front']) {
      setErrors(t('provide-identity-front'))
      return
    }
    if (!images['identity-back']) {
      setErrors(t('provide-identity-back'))
      return
    }
    if (!expireAt?.identity) {
      setErrors(t('provide-identity-expiry'))
      return
    }
    if (!images.passport) {
      setErrors(t('provide-passport'))
      return
    }
    if (!expireAt?.passport) {
      setErrors(t('provide-passport-expiry'))
      return
    }
    const allDocuments = { ...images, expireAt }
    uploadDataToServer({ ...info, ...allDocuments })
  }

  const uploadDataToServer = (info) => {
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
    dispatch(actions.users.registerUser(data))
  }

  const closeCropModal = () => {
    setIsCropPhoto(false)
    setImgData(null)
  }

  useEffect(() => {
    errors && window.scrollTo(0, 0)
  }, [errors])

  useEffect(() => {
    error && setErrors(error)
  }, [error])

  useEffect(() => {
    success && setStep(6)
  }, [success, setStep])

  useEffect(() => {
    dispatch({ type: constants.users.CHECK_INFO_RESET })
  }, [])

  useEffect(() => {
    if (Object.entries(info).length) {
      setImages({
        avatar: info.avatar,
        'identity-front': info['identity-front'],
        'identity-back': info['identity-back'],
        passport: info.passport,
      })
      setExpiryAt(info.expireAt)
      setFiles({
        avatar: info.avatar ? info.avatar?.name : 'personal-image',
        'identity-front': info['identity-front']
          ? info['identity-front']?.name
          : 'identity-image-front',
        'identity-back': info['identity-back']
          ? info['identity-back']?.name
          : 'identity-image-back',
        passport: info.passport ? info.passport?.name : 'passport-image',
      })

      setDateValue({
        identity: info.expireAt?.identity,
        passport: info.expireAt?.passport,
      })
    }
  }, [info])

  useEffect(() => {
    if (imgData) {
      setIsCropPhoto(true)
    }
  }, [imgData])

  useEffect(() => {
    if (images.avatar) {
      const url = URL.createObjectURL(images.avatar)
      setThumbnail({ ...thumbnail, personal: url })
    }
    if (images['identity-front']) {
      const url = URL.createObjectURL(images['identity-front'])
      setThumbnail({ ...thumbnail, front: url })
    }
    if (images['identity-back']) {
      const url = URL.createObjectURL(images['identity-back'])
      setThumbnail({ ...thumbnail, back: url })
    }
    if (images.passport) {
      const url = URL.createObjectURL(images.passport)
      setThumbnail({ ...thumbnail, passport: url })
    }
  }, [images])

  return (
    <>
      {errors && (
        <Alert variant='danger' onClose={() => setErrors(null)} dismissible>
          {errors}
        </Alert>
      )}

      <CameraPhoto
        isCamera={isCamera}
        setIsCamera={setIsCamera}
        uploadFileHandler={uploadFileHandler}
      />

      {imgData && (
        <CropModal
          defaultSrc={imgData.url}
          file={imgData.file}
          isCropPhoto={isCropPhoto}
          closePanel={closeCropModal}
          title={imgData.name}
          output={(output) => uploadFileHandler(output, imgData.name)}
        />
      )}

      <Preview previewSrc={previewSrc} setPreviewSrc={setPreviewSrc} />

      <Thumbnails thumbnail={thumbnail} setPreviewSrc={setPreviewSrc} />

      {/* UPLOAD PERSONAL PHOTO */}
      <div
        className={style.document}
        style={{ marginBottom: 0, flexDirection: 'row' }}
      >
        <Input
          name='avatar'
          label={t(files.avatar)}
          placeholder='upload-personal-image'
          type='file'
          icon={<AddressCard />}
          onChange={(e) => initiateEditImage(e)}
        />
        <span className={style.document__or}>{t('or')}</span>
        <div
          className={`${style.document__camera} ${
            lang === 'ar' ? style.document__camera_ar : ''
          }`}
          onClick={() => setIsCamera(true)}
        >
          <span>
            <Camera />
          </span>
          <p>{t('open-camera')}</p>
        </div>
      </div>
      <hr style={{ marginBottom: '2rem', backgroundColor: '#fff' }} />

      {/* UPLOAD IDENTITY DOCUMENT [FRONT SIDE]*/}
      <div className={style.document}>
        <Input
          name='identity-front'
          label={files['identity-front']}
          subLabel='front-side'
          placeholder='identity-image'
          type='file'
          onChange={(e) => initiateEditImage(e)}
          icon={<AddressCard />}
        />
      </div>

      {/* UPLOAD IDENTITY DOCUMENT [BACK SIDE] */}
      <div className={style.document}>
        <Input
          name='identity-back'
          label={files['identity-back']}
          subLabel='back-side'
          placeholder='identity-image'
          type='file'
          onChange={(e) => initiateEditImage(e)}
          icon={<AddressCard />}
        />
        <DateInput
          getExpiryDate={(value) => getExpiryDate('identity', value)}
          name='identity'
          value={dateValue.identity}
        />
      </div>

      {/* UPLOAD PASSPORT DOCUMENT */}
      <div className={style.document}>
        <Input
          name='passport'
          label={files.passport}
          placeholder='passport-image'
          type='file'
          onChange={(e) => initiateEditImage(e)}
          icon={<AddressCard />}
        />
        <DateInput
          getExpiryDate={(value) => getExpiryDate('passport', value)}
          name='passport'
          value={dateValue.passport}
        />
      </div>

      <Button
        value={t('next')}
        handler={moveNextHandler}
        loading={loading ? true : false}
      />
      <FormStepsChanger
        step={step}
        setStep={setStep}
        moveForwardHandler={moveNextHandler}
      />
    </>
  )
}

export default Documents
