import React, { useState } from 'react'
import style from './style.module.scss'
import { useDispatch } from 'react-redux'
import { OperationDecision } from '../../components'
import actions from '../../actions'
import { renderStateMessage } from '../../config/stateMessage'
import DueDateChange from './DueDateChange'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'

const Notification = ({ data }) => {
  const [isStateOn, setIsStateOn] = useState(false)
  const [isDueChange, setIsDueChange] = useState(false)

  const dispatch = useDispatch()

  const { t } = useTranslation()
  const lang = i18next.language

  const stateColorStyle = (_) => {
    const color =
      data.state === 'pending'
        ? '#FBFCD4'
        : data.state === 'active'
        ? '#C7FFCE'
        : data.state === 'decline'
        ? '#FCD4DB'
        : '#406882'

    return color
  }

  const takeDecisionHandler = (_) => {
    if (data.state === 'pending') {
      setIsStateOn(true)
    } else if (data.report && !data.isRead) {
      setIsDueChange(true)
    } else if (!data.report) {
      dispatch(actions.notifications.updateNotificationState(data.id))
    }
  }

  return (
    <>
      <OperationDecision
        show={isStateOn}
        setIsStateOn={setIsStateOn}
        id={data.operation}
        notificationId={data.id}
      />

      <DueDateChange
        isDueChange={isDueChange}
        setIsDueChange={setIsDueChange}
        report={data.report}
        date={data.payload?.date}
        englishName={data.payload?.englishName}
        arabicName={data.payload?.arabicName}
        id={data.id}
      />

      <div
        className={`${style.notification} ${
          lang === 'ar' ? style.notification_ar : ''
        }`}
        onClick={takeDecisionHandler}
        style={{ backgroundColor: data.isRead ? '#fff' : '#e7f5ff' }}
      >
        <img src={data.image} alt={data.title} />
        <div className={style.notification__content}>
          <h3>{data.title}</h3>
          <span>{data.date}</span>
          <p>{renderStateMessage(data.message, style.notification__report)}</p>
        </div>
        <div
          className={style.notification__state}
          style={{ backgroundColor: stateColorStyle() }}
        >
          <p style={{ color: data.state ? '#406882' : '#fff' }}>
            {t(data.state) || t('notice')}
          </p>
        </div>
      </div>
    </>
  )
}

export default Notification
