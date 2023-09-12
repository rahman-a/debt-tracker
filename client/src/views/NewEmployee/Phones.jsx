import React from 'react'
import style from './style.module.scss'
import { v4 as uuidv4 } from 'uuid'
import { Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { Plus, Minus } from '@/src/icons'

const Phones = ({
  insidePhones,
  setInsidePhones,
  outsidePhones,
  setOutsidePhones,
}) => {
  const { t } = useTranslation()

  const setInsidePhoneHandler = (id, value) => {
    const phones = [...insidePhones]
    phones.forEach((phone, idx) => {
      if (phone.id === id) {
        phone.phone = value
        phone.isPrimary = idx === 0
      }
    })
    setInsidePhones(phones)
  }

  const setOutsidePhoneHandler = (id, value) => {
    const phones = [...outsidePhones]
    phones.forEach((phone) => {
      if (phone.id === id) {
        phone.phone = value
      }
    })
    setOutsidePhones(phones)
  }

  const addRemoveInsidePhoneHandler = (type, id) => {
    if (type === 'add') {
      setInsidePhones([...insidePhones, { id: uuidv4(), email: '' }])
    } else if (type === 'remove' && insidePhones.length > 1) {
      const filteredPhones = insidePhones.filter((email) => email.id !== id)
      setInsidePhones(filteredPhones)
    }
  }

  const addRemoveOutsidePhoneHandler = (type, id) => {
    if (type === 'add') {
      setOutsidePhones([...outsidePhones, { id: uuidv4(), email: '' }])
    } else if (type === 'remove' && outsidePhones.length > 1) {
      const filteredPhones = outsidePhones.filter((email) => email.id !== id)
      setOutsidePhones(filteredPhones)
    }
  }

  return (
    <div className={style.employee__segment}>
      <h2>{t('phone-information')}</h2>

      {/* //////////// INSIDE PHONES /////////////////// */}
      <div>
        {insidePhones.map((val, idx) => (
          <div className={style.employee__multiple} key={val.id}>
            <Form.Group
              controlId='formBasicInsidePhone'
              className={`mb-3 ${style.employee__multiple_single}`}
            >
              <Form.Label>{t('phone-in-uae')}</Form.Label>
              <Form.Control
                size='lg'
                type='text'
                placeholder={t('enter-phone-in-uae')}
                onChange={(e) => setInsidePhoneHandler(val.id, e.target.value)}
              />
            </Form.Group>
            {idx === insidePhones.length - 1 && (
              <div className={style.employee__multiple_toggle}>
                <span onClick={() => addRemoveInsidePhoneHandler('add')}>
                  <Plus />
                </span>
                <span
                  onClick={() => addRemoveInsidePhoneHandler('remove', val.id)}
                >
                  <Minus />
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* //////////// OUTSIDE PHONES /////////////////// */}

      <div>
        {outsidePhones.map((val, idx) => (
          <div className={style.employee__multiple} key={val.id}>
            <Form.Group
              controlId='formBasicOutsidePhone'
              className={`mb-3 ${style.employee__multiple_single}`}
            >
              <Form.Label>{t('phone-out-uae')}</Form.Label>
              <Form.Control
                size='lg'
                type='text'
                placeholder={t('enter-phone-out-uae')}
                onChange={(e) => setOutsidePhoneHandler(val.id, e.target.value)}
              />
            </Form.Group>
            {idx === outsidePhones.length - 1 && (
              <div className={style.employee__multiple_toggle}>
                <span onClick={() => addRemoveOutsidePhoneHandler('add')}>
                  <Plus />
                </span>
                <span
                  onClick={() => addRemoveOutsidePhoneHandler('remove', val.id)}
                >
                  <Minus />
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Phones
