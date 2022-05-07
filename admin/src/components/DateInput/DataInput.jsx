import React, { useState } from 'react'
import style from './style.module.scss'
import DatePicker from 'react-date-picker'
import i18next from 'i18next'

const Input = ({ name, getExpiryDate, disabled, custom }) => {
  const [date, setDate] = useState(new Date())
  const [zIndex, setZIndex] = useState(1)
  const lang = i18next.language
  const getDateHandler = (value) => {
    setDate(value)
    getExpiryDate(value)
  }
  return (
    <div className={style.date} style={{ zIndex, ...custom }}>
      <DatePicker
        value={date}
        onChange={(value) => getDateHandler(value)}
        format='d-M-y'
        name={name}
        locale={lang}
        disabled={disabled}
        onCalendarOpen={() => setZIndex(2)}
        onCalendarClose={() => setZIndex(1)}
      />
    </div>
  )
}

export default Input
