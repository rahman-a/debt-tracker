import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import { Modal, Alert } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import classnames from 'classnames'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { Loader } from '@/src/components'
import { Lock, AtSymbol } from '@/src/icons'
import actions from '@/src/actions'
import constants from '@/src/constants'

const LoginForm = () => {
  const [isForget, setIsForget] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [resetLink, setResetLink] = useState('')
  const { loading, error } = useSelector((state) => state.login)
  const [errors, setErrors] = useState(null)
  const {
    loading: reset_loading,
    error: reset_error,
    message,
  } = useSelector((state) => state.sendResetLink)
  const { t } = useTranslation()
  const lang = i18next.language
  const dispatch = useDispatch()

  const clearAlert = (_) => {
    dispatch({ type: constants.admin.ADMIN_LOGIN_RESET })
  }

  const loginFormClasses = classnames(style.loginForm__reset_input, {
    [style.loginForm__reset_input_ar]: lang === 'ar',
  })

  const loginFormGroupClasses = classnames(style.loginForm__group, {
    [style.loginForm__group_ar]: lang === 'ar',
  })

  const submitLoginHandler = (e) => {
    const data = { email, password }
    dispatch(actions.admin.login(data))
  }

  const submitLoginOnKeyHandler = (e) => {
    if (e.keyCode === 13 || e.which === 13) {
      const data = { email, password }
      dispatch(actions.admin.login(data))
    }
  }

  const submitResetPasswordEmail = () => {
    if (!resetLink) {
      setErrors(t('type-primary-email'))
      return
    }
    dispatch(actions.admin.sendResetLink(resetLink))
  }

  useEffect(() => {
    reset_error && setErrors(reset_error)
  }, [reset_error])

  return (
    <>
      <Modal show={isForget} onHide={() => setIsForget(false)}>
        <Modal.Header>
          <h3 className={style.loginForm__reset_header}>
            {t('enter-email-reset-pass')}
          </h3>
        </Modal.Header>

        <Modal.Body>
          {reset_loading && (
            <Loader
              size='10'
              center
              options={{ animation: 'border' }}
              custom={{ zIndex: '99' }}
            />
          )}
          {message && (
            <p
              className={style.loginForm__reset_msg}
              style={{ color: '#025902', backgroundColor: '#d0f8eb' }}
            >
              {message}
            </p>
          )}
          {errors && (
            <p
              className={style.loginForm__reset_msg}
              style={{ color: '#590202', backgroundColor: '#f8d0d0' }}
            >
              {errors}
            </p>
          )}

          <div className={loginFormClasses}>
            <span>
              <AtSymbol />
            </span>
            <input
              type='email'
              name='email'
              onChange={(e) => setResetLink(e.target.value)}
              placeholder={t('enter-email')}
            />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <button
            className={style.loginForm__reset_btn}
            disabled={reset_loading}
            onClick={submitResetPasswordEmail}
          >
            {t('send-reset-pass-btn')}
          </button>
        </Modal.Footer>
      </Modal>
      {error && (
        <Alert variant='danger' dismissible onClose={() => clearAlert()}>
          {error}
        </Alert>
      )}
      <div className={style.loginForm} onKeyDown={submitLoginOnKeyHandler}>
        <div className={loginFormGroupClasses}>
          <span>
            <AtSymbol />
          </span>
          <input
            type='email'
            name='email'
            placeholder={t('enter-email')}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={loginFormGroupClasses}>
          <span>
            <Lock />
          </span>
          <input
            type='password'
            placeholder={t('enter-pass')}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          className={style.loginForm__submit}
          onClick={submitLoginHandler}
        >
          {loading ? (
            <Loader size='4' options={{ animation: 'border' }} />
          ) : (
            t('login-submit')
          )}
        </button>
        <button
          className={style.loginForm__forget}
          onClick={() => setIsForget(true)}
        >
          {t('forget-pass')}
        </button>
      </div>
    </>
  )
}

export default LoginForm
