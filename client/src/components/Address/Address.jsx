import React, { useState, useEffect } from 'react'
import { Alert } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { Input, Button, Countries, FormStepsChanger } from '../../components'
import { Map } from '../../icons'
import { sanitizeInput } from '../../config/sanitize'

const Address = ({ step, setStep, setInfo, info }) => {
  const [insideAddress, setInsideAddress] = useState('')
  const [outsideAddress, setOutsideAddress] = useState('')
  const [country, setCountry] = useState(null)
  const [error, setError] = useState('')
  const [toggleAlert, setToggleAlert] = useState(true)
  const { t } = useTranslation()

  const moveNextHandler = (_) => {
    setToggleAlert(true)

    if (!insideAddress) {
      setError(t('provide-address-in-uae'))
      return false
    }
    if (!country || !country.text) {
      setError(t('provide-country'))
      return false
    }

    let data = {
      insideAddress: sanitizeInput(insideAddress),
      country: { name: country.text, abbr: country.abbr, image: country.svg },
    }

    if (outsideAddress) {
      data = { ...data, outsideAddress: sanitizeInput(outsideAddress) }
    }

    setInfo({ ...info, ...data })
    setStep(4)
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [error])

  useEffect(() => {
    info.insideAddress && setInsideAddress(info.insideAddress)
    info.outsideAddress && setOutsideAddress(info.outsideAddress)
    info.country &&
      setCountry({
        text: info.country.name,
        abbr: info.country.abbr,
        svg: info.country.image,
      })
  }, [info])

  return (
    <>
      {toggleAlert && error && (
        <Alert
          variant='danger'
          onClose={() => setToggleAlert(false)}
          dismissible
        >
          {error}
        </Alert>
      )}
      <Input
        name='address'
        placeholder='address-in-uae'
        label='address-in-uae'
        type='text'
        icon={<Map />}
        value={insideAddress}
        onChange={(e) => setInsideAddress(e.target.value)}
        custom={{ marginBottom: '3rem' }}
      />

      <Input
        name='address'
        placeholder='address-out-uae'
        label='address-out-uae'
        type='text'
        icon={<Map />}
        value={outsideAddress}
        onChange={(e) => setOutsideAddress(e.target.value)}
        custom={{ marginBottom: '3rem' }}
      />

      <Countries
        selectedCountry={(country) => setCountry(country)}
        country={info.country}
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

export default Address
