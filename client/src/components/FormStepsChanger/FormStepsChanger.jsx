import React from 'react'
import i18next from 'i18next'
import style from './style.module.scss'
import { ArrowLeft, ArrowRight } from '../../icons'

const FormStepsChanger = ({ step, setStep, moveForwardHandler }) => {
  const lang = i18next.language

  const moveNextHandler = () => {
    moveForwardHandler ? moveForwardHandler() : setStep((prev) => prev + 1)
  }

  return (
    <div className={style.move}>
      <button disabled={step < 2} onClick={() => setStep((prev) => prev - 1)}>
        {lang === 'ar' ? <ArrowRight /> : <ArrowLeft />}{' '}
      </button>
      <button disabled={step >= 6} onClick={moveNextHandler}>
        {lang === 'ar' ? <ArrowLeft /> : <ArrowRight />}{' '}
      </button>
    </div>
  )
}

export default FormStepsChanger
