import React from 'react'
import style from './style.module.scss'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'
import classnames from 'classnames'
import { StarOfLife, File } from '@/src/icons'

const Required = ({ text, styles, step }) => {
  const lang = i18next.language
  const { t } = useTranslation()
  const requiredClasses = classnames(style.required, {
    [style.required__text]: text,
    [style.required__ar]: lang === 'ar',
    [style.required__text_ar]: text && lang === 'ar',
  })
  return (
    <div style={styles} className={requiredClasses}>
      <div className={style.required__data}>
        <div className={style.required__label}>
          <div className={style.required__star}>
            <span title={t('required-field')}>
              <StarOfLife />
            </span>
          </div>
          <p>{text}</p>
        </div>
        {text && step === 5 && (
          <div className={style.required__label}>
            <div className={style.required__max}>
              <span
                title={t('max-file-size', {
                  size: lang === 'en' ? '2MB' : '2 ميجابايت',
                })}
              >
                <File />
              </span>
            </div>
            <p>
              {t('max-file-size', {
                size: lang === 'en' ? '2MB' : '2 ميجابايت',
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Required
