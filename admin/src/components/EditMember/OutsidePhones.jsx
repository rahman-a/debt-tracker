import React, { useEffect } from 'react'
import style from './style.module.scss'
import { v4 as uuidv4 } from 'uuid'
import { Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { Plus, Minus } from '@/src/icons'

const OutsidePhones = ({ setInfo, info }) => {
  const { t } = useTranslation()

  const setPhoneHandler = (id, value) => {
    const newPhones = [...info.phones]
    newPhones.forEach((phone) => {
      if (phone.id === id) {
        phone.value = value
      }
    })
    setInfo({ phones: newPhones })
  }
  const addRemovePhoneHandler = (type, id) => {
    if (type === 'add') {
      setInfo({ phones: [...info.phones, { id: uuidv4(), value: '' }] })
    } else if (type === 'remove' && info.phones.length > 1) {
      const filteredPhones = info.phones.filter((phone) => phone.id !== id)
      setInfo({ phones: filteredPhones })
    }
  }

  useEffect(() => {
    setInfo({ phones: [{ id: uuidv4(), value: null }] })
  }, [])

  return (
    <div className={style.edit__phones}>
      <div>
        {info.phones &&
          info.phones.map((val, idx) => (
            <div className={style.edit__phones_multiple} key={val.id}>
              <Form.Group
                controlId='formBasicInsidePhone'
                className={`mb-3 ${style.edit__phones_single}`}
              >
                <Form.Label>{t('phone-out-uae')}</Form.Label>
                <Form.Control
                  size='lg'
                  type='text'
                  placeholder={t('enter-phone-out-uae')}
                  onChange={(e) => setPhoneHandler(val.id, e.target.value)}
                />
              </Form.Group>
              {idx === info.phones.length - 1 && (
                <div className={style.edit__phones_toggle}>
                  <span onClick={() => addRemovePhoneHandler('add')}>
                    <Plus />
                  </span>
                  <span onClick={() => addRemovePhoneHandler('remove', val.id)}>
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

export default OutsidePhones
