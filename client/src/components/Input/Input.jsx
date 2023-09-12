import React from 'react'
import style from './style.module.scss'
import { Badge } from 'react-bootstrap'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'
import classnames from 'classnames'
import { Required } from '@/src/components'

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
  subLabel,
  disabled,
  required,
  text,
}) => {
  const lang = i18next.language
  const { t } = useTranslation()

  const marginValue = {
    ar: '0 1rem 0 0',
    en: '0 0 0 1rem',
  }

  const inputClasses = classnames(style.input, {
    [style.input_ar]: lang === 'ar',
    [style.input__right]: direction === 'right',
    [style.input__upload]: type === 'file',
    [style.input__text]: text,
    [style.input__text_ar]: text && lang === 'ar',
    [className]: className,
  })

  const inputIconClasses = classnames(style.input__icon, {
    [style.input__icon_disabled]: disabled,
  })

  const inputTextDataClasses = classnames(style.input__text_data, {
    [style.input__text_ar_data]: lang === 'ar',
  })

  return (
    <div className={inputClasses} style={{ ...custom }}>
      {!(type === 'date') && <span className={inputIconClasses}>{icon}</span>}

      {type === 'file' && (
        <p className={style.input__upload_label}>
          {t(placeholder)}
          <Badge style={{ margin: marginValue[lang] }} bg='success'>
            {t(subLabel)}
          </Badge>
          <Required styles={{ marginLeft: '1rem' }} />
        </p>
      )}
      <div style={{ display: type !== 'file' && 'flex' }}>
        <label htmlFor={id || name}>{t(label)}</label>
        {required && <Required />}
      </div>
      {text && <span className={inputTextDataClasses}>{text}</span>}
      <input
        placeholder={t(placeholder)}
        name={name}
        type={type}
        id={id || name}
        defaultValue={defaultValue}
        value={value || ''}
        onChange={onChange}
        ref={inputRef}
        disabled={disabled}
        className={error ? style.input__error : ''}
        style={{
          border: type === 'file' ? '2px dashed #fff' : '',
          backgroundColor: type === 'file' ? 'transparent' : '#fff',
          padding:
            type === 'date'
              ? '1rem'
              : direction !== 'right' && !text && '1.5rem 1.5rem 1.5rem 5.5rem',
          color: '#1A374D',
        }}
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
