import React, { useState, useEffect } from 'react'
import style from './style.module.scss'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { Loader } from '../../components'
import actions from '../../actions'

const SendCode = ({ setIsCodeSent, setErrors }) => {
  const [isPhoneEdit, setIsPhoneEdit] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.updatePhoneNumber)
  const { userId, phone } = useSelector((state) => state.registerUser)
  const { loading: phone_loading, message: phone_message } = useSelector(
    (state) => state.sendPhoneCode
  )
  const lang = i18next.language
  const { t } = useTranslation()

  const isPhoneValid = () => {
    if (phoneNumber === '' || phoneNumber === ' ') {
      setErrors(t('provide-phone'))
      return false
    }

    if (!/^\d+$/.test(phoneNumber)) {
      setErrors(t('provide-valid-tel'))
      return false
    }

    if (phoneNumber.replace(/\D/g, '').startsWith('971')) {
      setErrors(t('remove-dialing-code'))
      return false
    }
    if (!/^(50|52|54|55|56|58)\d{7}$/.test(Number(phoneNumber))) {
      setErrors(t('provide-valid-uae-tel'))
      return false
    }

    return true
  }

  const sendPhoneCodeHandler = (_) => {
    dispatch(actions.users.sendCodeToPhone(userId))
  }

  const updatePhoneNumberHandler = (_) => {
    if (isPhoneValid())
      dispatch(actions.users.updatePhoneNumber(userId, phoneNumber))
  }

  const formattedPhone = () => {
    let newPhone = ''
    for (let i = 0; i < phone.length; i++) {
      if (i === 2 || i === 5) {
        newPhone += ' '
      }
      newPhone += phone[i]
    }
    return newPhone
  }

  useEffect(() => {
    if (phone_message) {
      setIsCodeSent(true)
    }
  }, [phone_message])
  return (
    <div className={style.done__code}>
      <div className={style.done__code_verify}>
        <p>{t('verify-phone-button')}</p>
        <button disabled={phone_loading} onClick={sendPhoneCodeHandler}>
          {phone_loading ? (
            <Loader size='4' center options={{ animation: 'border' }} />
          ) : (
            t('send-code')
          )}
        </button>
      </div>
      {!isPhoneEdit && (
        <p className={style.done__code_notice}>{t('phone-update-notice')}</p>
      )}
      <div className={style.done__code_info}>
        {isPhoneEdit ? (
          <div
            className={`${style.done__code_edit} ${
              lang === 'ar' ? style.done__code_edit_ar : ''
            }`}
          >
            <span>+971</span>
            <input
              type='number'
              placeholder={t('provide-new-tel')}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        ) : (
          <span>+971 85 245 2631</span>
        )}
        {isPhoneEdit ? (
          <div
            className={`${style.done__code_update} ${
              lang === 'ar' ? style.done__code_update_ar : ''
            }`}
          >
            <button disabled={loading} onClick={updatePhoneNumberHandler}>
              {loading ? (
                <Loader size='4' center options={{ animation: 'border' }} />
              ) : (
                t('edit-number')
              )}
            </button>
            <button onClick={() => setIsPhoneEdit(false)}>{t('cancel')}</button>
          </div>
        ) : (
          <button
            className={style.done__code_change}
            onClick={() => setIsPhoneEdit(true)}
          >
            {t('change-number')}
          </button>
        )}
      </div>
    </div>
  )
}

export default SendCode
