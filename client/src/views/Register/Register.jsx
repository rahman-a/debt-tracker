import React, { useState } from 'react'
import style from './style.module.scss'
import { useNavigate } from 'react-router-dom'

import {
  Address,
  Personal,
  Documents,
  Phones,
  Credential,
  Progress,
  Snapshot,
  Done,
} from '../../components'
import { ArrowRight } from '../../icons'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'

const Register = () => {
  const [step, setStep] = useState(5)
  const [info, setInfo] = useState({})
  const navigate = useNavigate()
  const lang = i18next.language
  const { t } = useTranslation()

  const Component = {
    1: (
      <Credential step={step} setStep={setStep} setInfo={setInfo} info={info} />
    ),
    2: <Personal step={step} setStep={setStep} setInfo={setInfo} info={info} />,
    3: <Address step={step} setStep={setStep} setInfo={setInfo} info={info} />,
    4: <Phones step={step} setStep={setStep} setInfo={setInfo} info={info} />,
    5: (
      <Documents step={step} setStep={setStep} setInfo={setInfo} info={info} />
    ),
    6: <Snapshot step={step} setStep={setStep} setInfo={setInfo} info={info} />,
    7: <Done setStep={setStep} />,
  }

  return (
    <div className={style.register}>
      <button
        style={{ direction: 'ltr' }}
        className={style.register__back}
        onClick={() => navigate('/')}
      >
        <span>
          <ArrowRight />
        </span>
        {t('back-home')}
      </button>
      <div className='container' style={{ paddingTop: '5rem' }}>
        <div
          className={`${style.register__wrapper} ${
            lang === 'ar' ? style.register__wrapper_ar : ''
          }`}
        >
          {step === 7 ? (
            <Done />
          ) : (
            <>
              <Progress step={step} />
              <div className={style.register__data}>{Component[step]}</div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Register
