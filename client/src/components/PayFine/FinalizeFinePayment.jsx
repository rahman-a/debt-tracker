import React, { useEffect } from 'react'
import styles from './style.module.scss'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'

const FinalizeFinePayment = ({ isTransactionActive }) => {
  const successClassNames = classNames(styles.fine__msg, styles.fine__success)
  const { t } = useTranslation()
  const lang = i18next.language
  useEffect(() => {
    let timeout
    if (isTransactionActive === false) {
      timeout = setTimeout(() => {
        window.location.reload()
      }, 5000)
    }
    return () => clearTimeout(timeout)
  }, [isTransactionActive])
  return (
    <div className={styles.fine__finalize}>
      <div className={successClassNames}>✅ {t('delayed_fine_paid')}</div>
      {isTransactionActive ? (
        <div className={styles.fine__finalize_msg}>
          <p className={styles.fine__finalize_text}>
            <strong>{t('be_informed')}</strong> {t('transaction_not_paid')}
          </p>
          <ul>
            <li className={styles.fine__finalize_text}>
              {t('transaction_still_open')}
            </li>
            <li className={styles.fine__finalize_text}>
              {t('badge_still_red', {
                member: lang === 'en' ? 'member' : 'العضو',
              })}
            </li>
          </ul>
        </div>
      ) : (
        <p
          style={{ fontSize: '1.6rem' }}
          className={styles.fine__finalize_text}
        >
          {t('transaction_now_closed')}
        </p>
      )}
    </div>
  )
}

export default FinalizeFinePayment
