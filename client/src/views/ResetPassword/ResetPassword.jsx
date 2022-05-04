import React, { useState } from 'react'
import style from './style.module.scss'
import { Button, Form, Alert } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Loader } from '../../components'
import actions from '../../actions'
import constants from '../../constants'

const ResetEmail = () => {
  const [resetPassword, setResetPassword] = useState(null)
  const [confirmPassword, setConfirmPassword] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const { loading, error, message } = useSelector(
    (state) => state.VerifyAuthLink
  )
  const dispatch = useDispatch()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const token = params.get('TOKEN')
  const { t } = useTranslation()

  const clearAlert = () => {
    dispatch({ type: constants.users.VERIFY_AUTH_LINK_RESET })
  }

  const submitFormData = (e) => {
    e.preventDefault()
    if (!token) {
      setErrorMessage(t('link-not-valid'))
      return
    }
    if (!resetPassword) {
      setErrorMessage(t('enter-new-pass'))
      return
    }
    if (!confirmPassword) {
      setErrorMessage(t('enter-new-pass-again'))
      return
    }
    if (resetPassword !== confirmPassword) {
      setErrorMessage(t('pass-not-match'))
      return
    }
    dispatch(
      actions.users.verifyAuthLink({
        type: 'reset',
        token,
        password: resetPassword,
      })
    )
  }

  return (
    <div className={style.reset}>
      <div className='container'>
        <div style={{ maxWidth: '50rem', margin: '0 auto' }}>
          {loading ? (
            <Loader
              size='5'
              center
              custom={{ color: '#fff', marginTop: '5rem' }}
              options={{ animation: 'border' }}
            />
          ) : errorMessage ? (
            <Alert
              variant='danger'
              style={{ textAlign: 'center' }}
              dismissible
              onClose={() => setErrorMessage(null)}
            >
              {errorMessage}
            </Alert>
          ) : error ? (
            <Alert
              variant='danger'
              style={{ textAlign: 'center' }}
              dismissible
              onClose={clearAlert}
            >
              {error}
            </Alert>
          ) : (
            message && (
              <Alert variant='success' style={{ textAlign: 'center' }}>
                {t('success_reset_pass')}
              </Alert>
            )
          )}
        </div>

        <div style={{ textAlign: 'center' }}>
          <Form
            onSubmit={submitFormData}
            style={{
              maxWidth: '50rem',
              margin: '2rem auto',
            }}
          >
            <Form.Group className='mb-5' controlId='formBasicPassword'>
              <Form.Label>{t('enter-new-pass')}</Form.Label>
              <Form.Control
                onChange={(e) => setResetPassword(e.target.value)}
                size='lg'
                type='password'
                placeholder={t('enter-new-pass')}
                className='p-3'
              />
            </Form.Group>
            <Form.Group className='mb-5' controlId='formBasicConfirmPassword'>
              <Form.Label>{t('enter-new-pass-again')}</Form.Label>
              <Form.Control
                onChange={(e) => setConfirmPassword(e.target.value)}
                size='lg'
                type='password'
                placeholder={t('enter-new-pass-again')}
                className='p-3'
              />
            </Form.Group>
            <Button
              disabled={loading ? true : false}
              variant='light'
              type='submit'
              size='lg'
            >
              {t('submit')}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default ResetEmail
