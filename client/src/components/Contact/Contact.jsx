import React, { useState, useEffect } from 'react'
import style from './style.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { Placeholder } from 'react-bootstrap'
import { Social, SideAlert, Loader } from '../../components'
import constants from '../../constants'
import actions from '../../actions'
import data from './data'

const Contact = () => {
  const [contact, setContact] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  })
  const [errors, setErrors] = useState(null)
  const [lang, setLang] = useState(i18next.language)
  const dispatch = useDispatch()
  const { loading, error, message } = useSelector(
    (state) => state.sendContactEmail
  )
  const { isLoading, contactUs } = useSelector((state) => state.getContactUs)
  const { t } = useTranslation()

  const getContactInformation = (e) => {
    const value = { [e.target.name]: e.target.value }
    setContact({ ...contact, ...value })
  }

  const isFormValid = (_) => {
    if (!contact['name']) {
      setErrors(t('name_is_required'))
      return false
    }
    if (!contact['email']) {
      setErrors(t('email_is_required'))
      return false
    }
    if (!contact['phone']) {
      setErrors(t('phone_is_required'))
      return false
    }
    if (!contact['message']) {
      setErrors(t('message_is_required'))
      return false
    }

    return true
  }

  const submitFormHandler = (e) => {
    e.preventDefault()
    if (isFormValid()) {
      dispatch(actions.users.sendContactEmail(contact))
    }
  }

  const clearAlert = (_) => {
    dispatch({ type: constants.users.SEND_CONTACT_RESET })
    setErrors(null)
  }

  useEffect(() => {
    error && setErrors(error)
  }, [error])

  useEffect(() => {
    !contactUs && dispatch(actions.content.getContactUs())
  }, [])

  useEffect(() => {
    i18next.on('languageChanged', (lng) => {
      setLang(lng)
    })
  }, [lang])

  return (
    <>
      <SideAlert
        type='danger'
        text={errors}
        isOn={errors ? true : false}
        reset={() => clearAlert()}
      />
      <SideAlert
        type='success'
        text={message}
        isOn={message ? true : false}
        reset={() => clearAlert()}
      />
      <div className={style.contact}>
        <div className={style.contact__container}>
          <div
            className={`${style.contact__form} ${
              lang === 'ar' ? style.contact__form_ar : ''
            }`}
          >
            <form>
              <input type='text' name='name' placeholder={t('enter-name')} />

              <input type='email' name='email' placeholder={t('enter-email')} />

              <input type='text' name='phone' placeholder={t('enter-phone')} />

              <textarea
                name='message'
                id='message'
                cols='30'
                rows='10'
                placeholder={t('enter-message')}
              ></textarea>

              <button>{t('contact-send')}</button>
            </form>
          </div>
          <div
            className={`${style.contact__content} ${
              lang === 'ar' ? style.contact__content_ar : ''
            }`}
          >
            <h3 className={style.contact__title}>
              <span>{data.header[lang]}</span>
            </h3>
            <p>{data.body[lang]}</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Contact
