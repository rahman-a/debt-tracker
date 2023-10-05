// @ts-nocheck
import React, { useState } from 'react'
import style from './style.module.scss'
import CopyToClipboard from 'react-copy-to-clipboard'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'
import { Copy, Check } from '@/src/icons'
import { EmployeeActions } from '@/src/components'
import {
  panelBodyDateClasses,
  panelBodyNameClasses,
  panelBodyPhotoClasses,
  panelHeaderIdClasses,
  panelHeaderStateClasses,
} from './classes'

const Panel = ({ user }) => {
  const [isCopied, setIsCopied] = useState(false)
  const lang = i18next.language
  const { t } = useTranslation()

  const copyIdHandler = (_) => {
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 500)
  }

  const dateFormat = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }

  return (
    <div className={style.panel}>
      <div className={style.panel__header}>
        <div className={panelHeaderIdClasses}>
          <CopyToClipboard text={user.code} onCopy={copyIdHandler}>
            <span>{isCopied ? <Check /> : <Copy />}</span>
          </CopyToClipboard>
          <span>{`#${user.code}`}</span>
        </div>
        <div className={panelHeaderStateClasses}>
          <EmployeeActions employee={user} isPanel />
        </div>
      </div>
      <div className={style.panel__body}>
        <figure
          className={panelBodyPhotoClasses}
          style={{ backgroundColor: user.status }}
        >
          <img src={`/api/files/${user.avatar}`} alt={user.fullNameInEnglish} />
        </figure>
        <div className={style.panel__body_data}>
          <div className={panelBodyNameClasses}>
            <p>
              {lang === 'ar' ? user.fullNameInArabic : user.fullNameInEnglish}
            </p>
          </div>
          <div className={panelBodyDateClasses}>
            {t('registration-date')}:
            <p>
              <span>
                {new Date(user.createdAt).toLocaleDateString(
                  'en-US',
                  dateFormat
                )}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Panel
