import React, { useState, useEffect } from 'react'
import style from './style.module.scss'
import { Alert } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import constants from '../../constants'
import { Input, Button, DateInput, FormStepsChanger } from '../../components'
import { AddressCard } from '../../icons'
import { useTranslation } from 'react-i18next'

const Documents = ({ step, setStep, setInfo, info }) => {
  const [errors, setErrors] = useState(null)
  const [images, setImages] = useState({
    avatar: null,
    'identity-front': null,
    'identity-back': null,
    passport: null,
  })

  const [files, setFiles] = useState({
    avatar: 'personal-image',
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
  const { t } = useTranslation()

  const uploadFileHandler = (e) => {
    let fileName = e.target.files[0].name
    if (fileName.length > 20) {
      fileName = fileName.substr(0, 20) + '...'
    }
    setFiles({ ...files, [e.target.name]: fileName })
    setImages({ ...images, [e.target.name]: e.target.files[0] })
  }

  const getExpiryDate = (name, value) => {
    setExpiryAt({ ...expireAt, [name]: value })
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
    if (!expireAt.identity) {
      setErrors(t('provide-identity-expiry'))
      return
    }
    if (!images.passport) {
      setErrors(t('provide-passport'))
      return
    }
    if (!expireAt.passport) {
      setErrors(t('provide-passport-expiry'))
      return
    }
    const allDocuments = { ...images, expireAt }
    setInfo({ ...info, ...allDocuments })
    setStep(6)
  }

  useEffect(() => {
    errors && window.scrollTo(0, 0)
  }, [errors])

  useEffect(() => {
    dispatch({ type: constants.users.CHECK_INFO_RESET })
  }, [])

  useEffect(() => {
    if (Object.entries(info).length) {
      console.log('documents', info)
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

  return (
    <>
      {errors && (
        <Alert variant='danger' onClose={() => setErrors(null)} dismissible>
          {errors}
        </Alert>
      )}

      {/* UPLOAD PERSONAL PHOTO */}
      <Input
        name='avatar'
        label={t(files.avatar)}
        placeholder='personal-image'
        type='file'
        icon={<AddressCard />}
        onChange={(e) => uploadFileHandler(e)}
        custom={{ marginBottom: '3rem' }}
      />
      <hr style={{ marginTop: '-2rem', backgroundColor: '#fff' }} />

      {/* UPLOAD IDENTITY DOCUMENT [FRONT SIDE]*/}
      <div className={style.document}>
        <Input
          name='identity-front'
          label={files['identity-front']}
          subLabel='front-side'
          placeholder='identity-image'
          type='file'
          onChange={(e) => uploadFileHandler(e)}
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
          onChange={(e) => uploadFileHandler(e)}
          icon={<AddressCard />}
        />
        <DateInput
          getExpiryDate={(value) => getExpiryDate('identity', value)}
          name='identity'
          value={dateValue.identity}
        />
        <hr />
      </div>

      {/* UPLOAD PASSPORT DOCUMENT */}
      <div className={style.document}>
        <Input
          name='passport'
          label={files.passport}
          placeholder='passport-image'
          type='file'
          onChange={(e) => uploadFileHandler(e)}
          icon={<AddressCard />}
        />
        <DateInput
          getExpiryDate={(value) => getExpiryDate('passport', value)}
          name='passport'
          value={dateValue.passport}
        />
        <hr />
      </div>

      <Button value={t('next')} handler={moveNextHandler} />
      <FormStepsChanger
        step={step}
        setStep={setStep}
        moveForwardHandler={moveNextHandler}
      />
    </>
  )
}

export default Documents
