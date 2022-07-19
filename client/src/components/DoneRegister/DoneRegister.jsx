import React, { useState, useEffect, useCallback } from 'react'
import style from './style.module.scss'
import { useSelector, useDispatch } from 'react-redux'
import { CircleCheck } from '../../icons'
import constants from '../../constants'
import SendCode from './SendCode'
import CodeSent from './CodeSent'
import { useTranslation } from 'react-i18next'

const OTPCode = () => {
  const [completeCreation, setCompleteCreation] = useState(false)
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const { error, message } = useSelector((state) => state.VerifyPhoneCode)

  const {
    error: updateError,
    message: updateMessage,
    loading: updateLoading,
  } = useSelector((state) => state.updatePhoneNumber)

  const dispatch = useDispatch()

  const { t } = useTranslation()

  const clearAlert = useCallback(() => {
    setErrorMessage(null)
    setSuccessMessage(null)
    dispatch({ type: constants.users.VERIFY_PHONE_CODE_RESET })
    dispatch({ type: constants.users.UPDATE_PHONE_RESET })
  }, [dispatch])

  useEffect(() => {
    if (message) {
      dispatch({ type: constants.users.VERIFY_PHONE_CODE_RESET })
      setCompleteCreation(true)
    }
    error && setErrorMessage(error)
  }, [message, error, dispatch])

  useEffect(() => {
    updateMessage && setSuccessMessage(updateMessage)
    updateError && setErrorMessage(updateError)
  }, [updateError, updateMessage])

  useEffect(() => {
    ;(errorMessage || successMessage) && window.scrollTo(0, 0)
  }, [errorMessage, successMessage])

  useEffect(() => {
    if (completeCreation || updateLoading || isCodeSent) {
      clearAlert()
    }
  }, [completeCreation, updateLoading, isCodeSent, clearAlert])

  return (
    <div className={style.done}>
      <span>
        <CircleCheck width='10rem' height='10rem' fill='#7dff6e' />
      </span>
      <h2 style={{ fontSize: '3.5rem', fontWeight: '100' }}>
        {t('congratulation')}
      </h2>
      <p style={{ marginBottom: '5rem', letterSpacing: '2px' }}>
        {t('account-created')}
      </p>
      {errorMessage && <p className={style.done__error}>{errorMessage}</p>}
      {successMessage && (
        <p className={style.done__success}>{successMessage}</p>
      )}
      {!isCodeSent && (
        <SendCode setIsCodeSent={setIsCodeSent} setErrors={setErrorMessage} />
      )}
      {!completeCreation && isCodeSent ? (
        <CodeSent />
      ) : (
        isCodeSent && (
          <>
            {/* Phone has been verified and Sent Link to E-mail */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CircleCheck width='2.5rem' height='2.5rem' fill='#7dff6e' />
              <p
                style={{
                  marginLeft: '1rem',
                  fontWeight: '400',
                  fontSize: '2rem',
                }}
              >
                {t('phone-verified')}
              </p>
            </div>
            <div className={style.done__emailSent}>
              {t('send-activation-link')}
            </div>
          </>
        )
      )}
    </div>
  )
}

export default OTPCode
