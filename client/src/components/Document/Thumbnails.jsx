import React from 'react'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'
import style from './style.module.scss'

const Thumbnails = ({ thumbnail, setPreviewSrc }) => {
  const { t } = useTranslation()
  const lang = i18next.language

  return (
    <div
      className={`${style.document__thumbnails} ${
        lang === 'ar' ? style.document__thumbnails_ar : ''
      }`}
    >
      <div>
        <figure onClick={() => setPreviewSrc(thumbnail?.personal)}>
          {thumbnail?.personal && (
            <img src={thumbnail?.personal} alt='personal' />
          )}
        </figure>
        <span>{t('avatar')}</span>
      </div>
      <div>
        <figure onClick={() => setPreviewSrc(thumbnail?.front)}>
          {thumbnail?.front && (
            <img src={thumbnail?.front} alt='front identity' />
          )}
        </figure>
        <span>{t('identity-front')}</span>
      </div>
      <div>
        <figure onClick={() => setPreviewSrc(thumbnail?.back)}>
          {thumbnail?.back && <img src={thumbnail?.back} alt='back identity' />}
        </figure>
        <span>{t('identity-back')}</span>
      </div>
      <div>
        <figure onClick={() => setPreviewSrc(thumbnail?.passport)}>
          {thumbnail?.passport && (
            <img src={thumbnail?.passport} alt='passport' />
          )}
        </figure>
        <span>{t('passport')}</span>
      </div>
    </div>
  )
}

export default Thumbnails
