import React, { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Alert } from 'react-bootstrap'
import { v4 as uuidv4 } from 'uuid'
import { Link } from 'react-router-dom'
import validator from 'validator'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { Input, SideButton, Button, FormStepsChanger } from '../../components'
import { EnvelopOpen, Key, Fingerprint } from '../../icons'
import constants from '../../constants'
import actions from '../../actions'
import { sanitizeInput } from '../../config/sanitize'

const Credential = ({ step, setStep, info, setInfo }) => {
  const [emails, setEmails] = useState([
    {
      _id: uuidv4(),
      value: '',
      isPrimary: true,
    },
  ])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [userData, setUserData] = useState(null)
  const [isAgree, setIsAgree] = useState(false)
  const [errors, setErrors] = useState('')
  const inputRef = useRef()
  const userRef = useRef()
  const { loading, error, success } = useSelector((state) => state.checkInfo)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const lang = i18next.language

  const submitHandler = (_) => {
    if (isFormValid()) {
      const allEmails = emails.map((email) => {
        return { isPrimary: email.isPrimary, email: email.value }
      })

      const info = {
        username: sanitizeInput(username),
        emails: allEmails,
        password: sanitizeInput(password),
      }

      setErrors('')
      setUserData(info)
      dispatch(
        actions.users.checkInfo({
          username: info.username,
          emails: allEmails,
        })
      )
    }
  }

  const isFormValid = (_) => {
    if (!username) {
      setErrors(t('provide-unique-username'))
      return false
    }

    if (emails.length === 0) {
      setErrors(t('provide-least-one-email'))
      return false
    }

    if (emails.length > 0) {
      for (const email of emails) {
        if (!validator.isEmail(email.value)) {
          setErrors(t('provide-valid-email'))
          return false
        }
      }
    }

    if (!password) {
      setErrors(t('provide-password'))
      return false
    }

    if (password !== confirmPassword) {
      console.log({ password })
      console.log({ confirmPassword })
      setErrors(t('pass-not-match'))
      return false
    }

    if (!isAgree) {
      setErrors(t('agree-terms-condition'))
      return false
    }

    return true
  }

  const setEmailsHandler = (e, id) => {
    const newEmails = emails.map((email) => {
      if (email._id === id) {
        return { ...email, value: e.target.value }
      }
      return email
    })
    setEmails(newEmails)
  }

  const closeAlertHandler = () => {
    dispatch({ type: constants.users.CHECK_INFO_RESET })
    setErrors('')
  }

  const addMoreEmailHandler = (_) => {
    setEmails([...emails, { _id: uuidv4(), isPrimary: false, value: '' }])
  }

  const removeMoreEmailHandler = (id) => {
    const updatedEmails = emails.filter((email) => email._id !== id)
    setEmails(updatedEmails)
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [errors])

  useEffect(() => {
    error && setErrors(error)
    if (success) {
      setInfo({ ...info, ...userData })
      setStep(2)
    }
  }, [error, success])

  useEffect(() => {
    if (info.emails?.length) {
      setEmails(
        info.emails.map((email) => ({
          value: email.email,
          isPrimary: email.isPrimary,
          _id: uuidv4(),
        }))
      )
    }
    if (info.username) {
      setUsername(info.username)
      setIsAgree(true)
    }
    if (info.password) {
      setPassword(info.password)
      setConfirmPassword(info.password)
    }
  }, [info])

  return (
    <>
      {/* Alerts */}
      {errors && (
        <Alert
          key={uuidv4()}
          variant='danger'
          onClose={closeAlertHandler}
          dismissible
        >
          {errors}
        </Alert>
      )}

      {/* INPUTS TO ENTER USERNAME*/}
      <Input
        type='text'
        placeholder='type-unique-username'
        name='username'
        label='type-unique-username'
        icon={<Fingerprint />}
        custom={{ marginBottom: '3rem' }}
        value={username}
        inputRef={userRef}
        onChange={(e) => setUsername(e.target.value)}
      />

      {/* INPUTS TO ENTER Emails*/}
      {emails.map((email, idx) => {
        return (
          <div
            key={email._id}
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Input
              name='email'
              id={`email-${idx + 1}`}
              placeholder={idx > 0 ? 'add-another-email' : 'main-email'}
              label={idx > 0 ? 'add-another-email' : 'main-email'}
              type='email'
              icon={<EnvelopOpen />}
              custom={{ marginBottom: '3rem' }}
              value={email.value}
              inputRef={inputRef}
              onChange={(e) => setEmailsHandler(e, email._id)}
            />
            {emails.length === idx + 1 && (
              <SideButton
                text={t('another-email')}
                handler={addMoreEmailHandler}
              />
            )}
            {emails.length === idx + 1 && emails.length > 1 && (
              <SideButton
                minus
                text={t('remove-email')}
                handler={() => removeMoreEmailHandler(email._id)}
              />
            )}
          </div>
        )
      })}

      <Input
        name='password'
        placeholder='password'
        label='password'
        type='password'
        icon={<Key />}
        value={password}
        custom={{ marginBottom: '3rem' }}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Input
        name='confirmPassword'
        placeholder='confirm-pass'
        label='confirm-pass'
        type='password'
        icon={<Key />}
        value={confirmPassword}
        custom={{ marginBottom: '3rem' }}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          textAlign: 'start',
          marginTop: '-2rem',
          color: '#fff',
          transform: 'translateX(10px)',
        }}
      >
        <input
          type='checkbox'
          name='isAgree'
          style={{
            marginRight: lang === 'ar' ? 'unset' : '1rem',
            marginLeft: lang === 'ar' ? '1rem' : 'unset',
          }}
          checked={isAgree}
          onChange={(e) => setIsAgree(!isAgree)}
        />
        <label
          style={{
            fontSize: '1.4rem',
          }}
          htmlFor='terms'
        >
          {t('i-agree')}
          <Link
            to='/terms-conditions'
            style={{
              color: '#B1D0E0',
              marginRight: lang === 'ar' ? '0.5rem' : 'unset',
              marginLeft: lang === 'en' ? '0.5rem' : 'unset',
            }}
          >
            {t('condition&terms')}
          </Link>
        </label>
      </div>
      <Button
        value={t('next')}
        handler={submitHandler}
        loading={loading && loading}
      />
      <FormStepsChanger
        step={step}
        setStep={setStep}
        moveForwardHandler={submitHandler}
      />
    </>
  )
}

export default Credential
