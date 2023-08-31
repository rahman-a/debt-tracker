import React from 'react'
import style from './style.module.scss'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'
import classnames from 'classnames'

const Input = ({
  icon,
  label,
  type,
  placeholder,
  name,
  id,
  error,
  value,
  inputRef,
  defaultValue,
  onChange,
  direction,
  className,
  custom,
  options,
  disabled,
}) => {
  const lang = i18next.language
  const { t } = useTranslation()
  const inputClasses = classnames(style.input, {
    [style.input_ar]: lang === 'ar',
    [style.input__right]: direction === 'right',
    [style.input__upload]: type === 'file',
    [className]: className,
  })

  const inputIconClasses = classnames(style.input__icon, {
    [style.input__icon_disabled]: disabled,
  })

  const inputStyles = {
    border: type === 'file' ? '2px dashed #fff' : '',
    backgroundColor: type === 'file' ? 'transparent' : '#fff',
    color: '#333',
    padding:
      type === 'date'
        ? '1rem'
        : icon
        ? '1.5rem 1.5rem 1.5rem 5.5rem'
        : '0.3rem 1rem',
  }
  return (
    <div className={inputClasses} style={{ ...custom }}>
      {!(type === 'date') && <span className={inputIconClasses}>{icon}</span>}

      {type === 'file' && (
        <p className={style.input__upload_label}>{t(placeholder)}</p>
      )}
      <label htmlFor={id || name}>{t(label)}</label>

      <input
        placeholder={t(placeholder)}
        name={name}
        type={type}
        id={id || name}
        defaultValue={defaultValue}
        onChange={onChange}
        ref={inputRef}
        disabled={disabled}
        className={error ? style.input__error : ''}
        style={inputStyles}
        {...options}
      />

      {error && (
        <>
          <strong>ERROR</strong>
          <p className={style.input__error_text}>{error}</p>
        </>
      )}
    </div>
  )
}

export default Input
