import React from 'react'
import style from './style.module.scss'
import { StarOfLife } from '../../icons'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'

const Required = ({ text, styles }) => {
  const lang = i18next.language
  const { t } = useTranslation()

  return (
    <div
      style={styles}
      className={`
        ${style.required} 
        ${text && style.required__text}
        ${lang === 'ar' && style.required__ar}
        ${lang === 'ar' && text && style.required__text_ar}`}
    >
      <div className={style.required__star}>
        <span title={t('required-field')}>
          <StarOfLife />
        </span>
      </div>
      <p>{text}</p>
    </div>
  )
}

export default Required
