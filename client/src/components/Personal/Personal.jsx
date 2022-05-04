import React, { useState, useEffect } from 'react'
import { Alert } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Input, Button, FormStepsChanger } from '../../components'
import { User, Building } from '../../icons'
import { sanitizeInput } from '../../config/sanitize'
import constants from '../../constants'

const Personal = ({ step, setStep, setInfo, info }) => {
  const [englishName, setEnglishName] = useState('')
  const [arabicName, setArabicName] = useState('')
  const [company, setCompany] = useState('')
  const [errors, setErrors] = useState(null)
  const [toggleAlert, setToggleAlert] = useState(true)
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const moveNextHandler = (_) => {
    const data = {
      fullNameInEnglish: sanitizeInput(englishName),
      fullNameInArabic: sanitizeInput(arabicName),
      company: sanitizeInput(company),
    }

    if (isFormValid()) {
      setInfo({ ...info, ...data })
      setStep(3)
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [errors])

  useEffect(() => {
    info.fullNameInArabic && setArabicName(info.fullNameInArabic)
    info.fullNameInEnglish && setEnglishName(info.fullNameInEnglish)
    info.company && setCompany(info.company)
  }, [info])

  useEffect(() => {
    dispatch({ type: constants.users.CHECK_INFO_RESET })
  }, [])

  const isFormValid = (_) => {
    setToggleAlert(true)
    if (!englishName) {
      setErrors(t('provide-full-name-english'))
      return false
    }

    if (!arabicName) {
      setErrors(t('provide-full-name-arabic'))
      return false
    }

    return true
  }

  return (
    <>
      {toggleAlert && errors && (
        <Alert
          variant='danger'
          onClose={() => setToggleAlert(false)}
          dismissible
        >
          {errors}
        </Alert>
      )}
      <Input
        type='text'
        placeholder='full-name-in-english'
        name='fullNameInEnglish'
        label='full-name-in-english'
        icon={<User />}
        value={englishName}
        onChange={(e) => setEnglishName(e.target.value)}
        custom={{ marginBottom: '3rem', direction: 'ltr', textAlign: 'left' }}
      />

      <Input
        type='text'
        placeholder='full-name-in-arabic'
        name='fullNameInArabic'
        label='full-name-in-arabic'
        icon={<User />}
        value={arabicName}
        onChange={(e) => setArabicName(e.target.value)}
        direction='right'
        custom={{ marginBottom: '3rem', fontFamily: 'Cairo', direction: 'rtl' }}
      />

      <Input
        type='text'
        placeholder='company-name'
        name='Company'
        label='company-name'
        icon={<Building />}
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        custom={{ marginBottom: '3rem' }}
      />

      <Button value={t('next')} handler={moveNextHandler} />
      <FormStepsChanger
        step={step}
        setStep={setStep}
        moveForwardHandler={moveNextHandler}
      />
    </>
  )
}

export default Personal
