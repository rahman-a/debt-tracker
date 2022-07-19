import React, { useState } from 'react'
import style from './style.module.scss'
import { useSelector, useDispatch } from 'react-redux'
import { Input, SideButton, Loader } from '../../components'
import { CircleCheck } from '../../icons'
import { useTranslation } from 'react-i18next'
import actions from '../../actions'

const CodeSent = () => {
  const [phoneCode, setPhoneCode] = useState(null)
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [codeSentAgain, setCodeSentAgain] = useState(false)
  const { userId } = useSelector((state) => state.registerUser)
  const { loading } = useSelector((state) => state.VerifyPhoneCode)
  const { loading: phone_loading, message } = useSelector(
    (state) => state.sendPhoneCode
  )

  const verifyPhoneCodeHandler = (_) => {
    dispatch(actions.users.verifyPhoneCode(userId, phoneCode))
  }

  const sendPhoneCodeHandler = (_) => {
    setCodeSentAgain(true)
    dispatch(actions.users.sendCodeToPhone(userId))
  }
  return (
    <>
      {/* Sent Code To Verify Phone Number */}
      <p>{t('code-sent-phone')}</p>
      <p>{t('type-code-activate')}</p>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: '1.5rem',
        }}
      >
        <Input
          type='number'
          name='otp'
          placeholder='type-code-sent-phone'
          onChange={(e) => setPhoneCode(e.target.value)}
          value={phoneCode}
          icon={<strong className={style.done__icon}>OTP</strong>}
        />
        <SideButton
          noIcon
          text={!loading && <CircleCheck />}
          loading={loading}
          custom={{ transform: 'translateY(3px)', height: '5.5rem' }}
          handler={verifyPhoneCodeHandler}
        />
      </div>
      <button className={style.done__sentAgain} onClick={sendPhoneCodeHandler}>
        {phone_loading ? (
          <Loader size='4' options={{ animation: 'border' }} />
        ) : (
          t('send-code-again')
        )}
      </button>
      {message && codeSentAgain && (
        <p className={style.done__success}>{message}</p>
      )}
    </>
  )
}

export default CodeSent
