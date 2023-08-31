import React from 'react'
import style from './style.module.scss'
import { useTranslation } from 'react-i18next'

const NotFound = () => {
  const { t } = useTranslation()
  return (
    <div className={style.notfound}>
      <h3>404 | {t('page-not-found')}</h3>
    </div>
  )
}

export default NotFound
