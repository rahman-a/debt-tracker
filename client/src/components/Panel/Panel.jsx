import React, { useState, useEffect } from 'react'
import style from './style.module.scss'
import CopyToClipboard from 'react-copy-to-clipboard'
import { Badge } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'
import { Copy, Check, HandshakeSlash } from '../../icons'
import { Currency, CloseReport, ChangeDue } from '../../components'
import Decision from './Decision'
import ChatComponent from './Chat'

const Panel = ({ record, reports, due, op, closed }) => {
  const [isCopied, setIsCopied] = useState(false)
  const [isDueChange, setIsDueChange] = useState(false)
  const [isReportClose, setIsReportClose] = useState(false)
  const [isDecision, setIsDecision] = useState(false)
  const [isShow, setIsShow] = useState(false)
  const [note, setNote] = useState('')
  const { user } = useSelector((state) => state.login)
  const lang = i18next.language
  const { t } = useTranslation()

  const copyIdHandler = (_) => {
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 500)
  }

  const isCurrentUserPeer = (_) => {
    return (
      record.peer.user._id === user._id ||
      record.operation?.peer._id === user._id
    )
  }

  const peerType = (_) => {
    const type =
      record.initiator?.user?._id === user._id ||
      record.operation?.initiator?._id === user._id
        ? record.peer?.type || record.operation.peer.type
        : record.peer?.user?._id === user._id ||
          record.operation.peer._id === user._id
        ? record.initiator?.type || record.operation.initiator.type
        : 'N/A'

    return type
  }

  const isCurrentUserCredit = (_) => {
    if (!op) {
      const creditor =
        record.operation.initiator.type === 'credit'
          ? record.operation.initiator._id
          : record.operation.peer._id
      if (creditor === user._id) return true
    }

    return false
  }

  const getMemberName = (_) => {
    if (lang === 'ar') {
      return (record.peer?.user?._id || record.operation.peer._id) === user._id
        ? record.initiator?.user?.fullNameInArabic ||
            record.operation.initiator.fullNameInArabic
        : record.peer?.user?.fullNameInArabic ||
            record.operation.peer.fullNameInArabic
    } else {
      return (record.peer?.user?._id || record.operation.peer._id) === user._id
        ? record.initiator?.user?.fullNameInEnglish ||
            record.operation.initiator.fullNameInEnglish
        : record.peer?.user?.fullNameInEnglish ||
            record.operation.peer.fullNameInEnglish
    }
  }

  const getPeerId = (_) => {
    const id =
      (record.peer?.user?._id || record.operation.peer._id) === user._id
        ? record.initiator?.user?._id || record.operation.initiator._id
        : record.peer?.user?._id || record.operation.peer._id

    return id
  }

  const getStateColor = (state) => {
    const states = {
      pending: '#FBFCD4',
      approved: '#C7FFCE',
      decline: '#FCD4DB',
      active: '#C7FFCE',
      closed: '#FCD4DB',
    }
    return states[state]
  }

  useEffect(() => {
    setNote(record?.note || record?.operation?.note)
  }, [record])
  return (
    <>
      <Decision
        isDecision={isDecision}
        setIsDecision={setIsDecision}
        id={record._id}
      />
      <ChangeDue
        isDueChange={isDueChange}
        setIsDueChange={setIsDueChange}
        id={record._id}
        op={op}
      />

      <CloseReport
        isReportClose={isReportClose}
        setIsReportClose={setIsReportClose}
        report={record._id}
      />
      <div className={style.panel}>
        <div className={style.panel__header}>
          <div className={style.panel__header_id}>
            <CopyToClipboard text={record._id} onCopy={copyIdHandler}>
              <span>{isCopied ? <Check /> : <Copy />}</span>
            </CopyToClipboard>
            <span>{`#${record._id}`.substring(0, 15) + '...'}</span>
          </div>
          <div className={style.panel__header_state}>
            <ChatComponent id={getPeerId()} />
            {reports ? (
              <span
                style={{ backgroundColor: 'darkgreen', color: '#fff' }}
                className={`${style.panel__close} 
                   ${!isCurrentUserCredit() ? style.panel__disabled : ''}`}
                onClick={() => isCurrentUserCredit() && setIsReportClose(true)}
              >
                {t('complete-payment')}
                <HandshakeSlash style={{ marginLeft: '0.5rem' }} />
              </span>
            ) : (
              <span
                style={{
                  backgroundColor: getStateColor(record.state),
                  textTransform: 'uppercase',
                }}
                className={
                  record.state === 'pending' &&
                  !isCurrentUserPeer() &&
                  style.panel__disabled
                }
                onClick={() =>
                  record.state === 'pending' &&
                  isCurrentUserPeer() &&
                  setIsDecision(true)
                }
              >
                {t(record.state)}
              </span>
            )}
          </div>
        </div>
        <div className={style.panel__body}>
          <figure
            className={`${style.panel__body_photo} ${
              lang === 'ar' ? style.panel__body_photo_ar : ''
            }`}
            style={{
              backgroundColor:
                (record.peer?.user?._id || record.operation.peer._id) ===
                user._id
                  ? record.initiator?.user?.color ||
                    record.operation.initiator.color
                  : record.peer?.user?.color || record.operation.peer.color,
            }}
          >
            <img
              src={
                (record.peer?.user?._id || record.operation.peer._id) ===
                user._id
                  ? `/api/files/${
                      record.initiator?.user?.avatar ||
                      record.operation.initiator.avatar
                    }`
                  : `/api/files/${
                      record.peer?.user?.avatar || record.operation.peer.avatar
                    }`
              }
              alt='second peer'
            />
          </figure>
          <div className={style.panel__body_data}>
            <div
              className={`${style.panel__body_name} ${
                lang === 'ar' ? style.panel__body_name_ar : ''
              }`}
            >
              <p>{getMemberName().substring(0, 25) + '...'}</p>
              <span
                className={style.panel__label}
                style={{
                  backgroundColor:
                    peerType() === 'debt' ? '#198754' : '#1a374d',
                }}
              >
                {(record.peer?.user?._id || record.operation.peer._id) ===
                user._id
                  ? t(record.initiator?.type) ||
                    t(record.operation.initiator.type)
                  : t(record.peer?.type) || t(record.operation.peer.type)}
              </span>
            </div>
            <div
              className={`${style.panel__body_value} ${
                lang === 'ar' ? style.panel__body_value_ar : ''
              }`}
            >
              <h3>
                {record.peer?.value ||
                  (record.debt > 0 ? record.debt : record.credit)}
              </h3>
              {<Currency currency={record.currency} inline noName />}
            </div>
            <div
              className={`${style.panel__body_date} ${
                lang === 'ar' ? style.panel__body_date_ar : ''
              }`}
            >
              {t('due-date')}:
              <p>
                {record.paymentDate ? (
                  <span>
                    {new Date(record.paymentDate).toLocaleDateString()}
                  </span>
                ) : record.dueDate ? (
                  <span
                    className={isCurrentUserCredit() ? style.panel__due : ''}
                    onClick={() =>
                      isCurrentUserCredit() && setIsDueChange(true)
                    }
                  >
                    {new Date(record.dueDate).toLocaleDateString()}
                  </span>
                ) : (
                  <Badge bg='dark'>N/A</Badge>
                )}
              </p>
            </div>
          </div>
        </div>
        {note && (
          <div
            className={`${style.panel__note} ${
              isShow ? style.panel__note_show : ''
            }`}
          >
            <span onClick={() => setIsShow((prev) => !prev)}>
              {isShow ? note : note.substring(0, 100) + '...'}
            </span>
          </div>
        )}
      </div>
    </>
  )
}

export default Panel
