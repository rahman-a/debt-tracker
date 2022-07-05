import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Input, Button, Countries, FormStepsChanger } from '../../components'
import { Map } from '../../icons'
import { sanitizeInput } from '../../config/sanitize'

const Address = ({ step, setStep, setInfo, info }) => {
  const [insideAddress, setInsideAddress] = useState('')
  const [outsideAddress, setOutsideAddress] = useState('')
  const [country, setCountry] = useState(null)
  const { t } = useTranslation()

  const moveNextHandler = (_) => {
    let data = {}
    if (insideAddress) {
      data = { insideAddress: sanitizeInput(insideAddress) }
    }

    if (country) {
      data = {
        ...data,
        country: { name: country.text, abbr: country.abbr, image: country.svg },
      }
    }

    if (outsideAddress) {
      data = { ...data, outsideAddress: sanitizeInput(outsideAddress) }
    }

    setInfo({ ...info, ...data })
    setStep(4)
  }

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
