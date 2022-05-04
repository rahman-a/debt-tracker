import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert } from 'react-bootstrap'
import { v4 as uuidv4 } from 'uuid'
import { Input, SideButton, Button, FormStepsChanger } from '../../components'
import { Phone } from '../../icons'
import actions from '../../actions'
import { useTranslation } from 'react-i18next'

const Phones = ({ step, setStep, info, setInfo }) => {
  const [insidePhones, setInsidePhones] = useState([
    { _id: uuidv4(), value: '', isPrimary: true },
  ])
  const [outsidePhones, setOutsidePhones] = useState([
    { _id: uuidv4(), value: '' },
  ])
  const [errors, setErrors] = useState('')
  const [phones, setPhones] = useState(null)
  const { loading, error, success } = useSelector((state) => state.checkInfo)
  const dispatch = useDispatch()
  const insideRef = useRef()
  const outsideRef = useRef()
  const { t } = useTranslation()

  const moveNextHandler = (_) => {
    if (!insidePhones.length) {
      setErrors(t('provide-phone'))
      return false
    } else {
      for (let phone of insidePhones) {
        if (phone.value === '' || phone.value === ' ') {
          setErrors(t('provide-phone'))
          return false
        }

        if (!/^\d+$/.test(phone.value)) {
          setErrors(t('provide-valid-tel'))
          return false
        }

        if (phone.value.replace(/\D/g, '').startsWith('971')) {
          setErrors(t('remove-dialing-code'))
          return false
        }
      }
    }

    const insidePhonesCollection = insidePhones.map((phone) => {
      return { isPrimary: phone.isPrimary, phone: phone.value }
    })

    let data = { insidePhones: insidePhonesCollection }

    for (const phone of outsidePhones) {
      if (phone.value !== '' && phone.value !== ' ') {
        if (!/^\d+$/.test(phone.value)) {
          setErrors(t('provide-valid-tel'))
          return false
        }
        data['outsidePhones'] = outsidePhones.map((phone) => phone.value)
      }
    }

    setPhones(data)
    dispatch(actions.users.checkInfo({ phones: insidePhonesCollection }))
  }

  const setInsidePhoneHandler = (e, id) => {
    const phones = insidePhones.map((phone) => {
      if (phone._id === id) {
        phone.value = e.target.value
      }
      return phone
    })
    setInsidePhones(phones)
  }

  const setOutsidePhonesHandler = (e, id) => {
    const phones = outsidePhones.map((phone) => {
      if (phone._id === id) {
        phone.value = e.target.value
      }
      return phone
    })
    setOutsidePhones(phones)
  }

  const addMorePhoneHandler = (where) => {
    if (where === 'inside') {
      setInsidePhones([
        ...insidePhones,
        { _id: uuidv4(), value: '', isPrimary: false },
      ])
    } else {
      setOutsidePhones([...outsidePhones, { _id: uuidv4(), value: '' }])
    }
  }

  const removeMorePhoneHandler = (where, id) => {
    if (where === 'inside') {
      const phones = insidePhones.filter((phone) => phone._id !== id)
      setInsidePhones(phones)
    } else {
      const phones = outsidePhones.filter((phone) => phone._id !== id)
      setOutsidePhones(phones)
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [errors])

  useEffect(() => {
    error && setErrors(error)
    if (success) {
      setInfo({ ...info, ...phones })
      setStep(5)
    }
  }, [error, success])

  useEffect(() => {
    if (info.insidePhones?.length) {
      setInsidePhones(
        info.insidePhones.map((phone) => ({
          _id: uuidv4(),
          value: phone.phone,
          isPrimary: phone.isPrimary,
        }))
      )
    }
    if (info.outsidePhones?.length) {
      setOutsidePhones(
        info.outsidePhones.map((phone) => ({
          _id: uuidv4(),
          value: phone,
        }))
      )
    }
  }, [info])

  return (
    <>
      {errors && (
        <Alert variant='danger' onClose={() => setErrors('')} dismissible>
          {errors}
        </Alert>
      )}
      <span style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '2rem' }}>
        {' '}
        {t('enter-phone-without-emirates-code')}{' '}
      </span>
      {/* INPUTS TO ENTER PHONES NUMBERS INSIDE UAE*/}
      {insidePhones.map((phone, idx) => {
        return (
          <div
            key={phone._id}
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Input
              name='insidePhone'
              placeholder='phone-in-uae'
              label='phone-in-uae'
              type='number'
              icon={<Phone />}
              value={phone.value}
              onChange={(e) => setInsidePhoneHandler(e, phone._id)}
              inputRef={insideRef}
              custom={{ marginBottom: '3rem' }}
            />
            {insidePhones.length === idx + 1 && (
              <SideButton
                text={t('another-phone')}
                handler={() => addMorePhoneHandler('inside')}
              />
            )}
            {insidePhones.length === idx + 1 && insidePhones.length > 1 && (
              <SideButton
                minus
                text={t('remove-phone')}
                handler={() => removeMorePhoneHandler('inside', phone._id)}
              />
            )}
          </div>
        )
      })}

      {/* INPUTS TO ENTER PHONES NUMBERS OUTSIDE UAE*/}
      {outsidePhones.map((phone, idx) => {
        return (
          <div
            key={phone._id}
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Input
              name='outsidePhone'
              placeholder='phone-out-uae'
              label='phone-out-uae'
              type='number'
              icon={<Phone />}
              value={phone.value}
              onChange={(e) => setOutsidePhonesHandler(e, phone._id)}
              inputRef={outsideRef}
              custom={{ marginBottom: '3rem' }}
            />
            {outsidePhones.length === idx + 1 && (
              <SideButton
                text={t('another-phone')}
                handler={() => addMorePhoneHandler('outside')}
              />
            )}
            {outsidePhones.length === idx + 1 && outsidePhones.length > 1 && (
              <SideButton
                minus
                text={t('remove-phone')}
                handler={() => removeMorePhoneHandler('outside', phone._id)}
              />
            )}
          </div>
        )
      })}

      <Button
        value={t('next')}
        handler={moveNextHandler}
        loading={loading && loading}
      />
      <FormStepsChanger
        step={step}
        setStep={setStep}
        moveForwardHandler={moveNextHandler}
      />
    </>
  )
}

export default Phones
