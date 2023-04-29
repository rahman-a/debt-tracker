import React, { useState, useEffect, useRef } from 'react'
import style from './style.module.scss'
import CopyToClipboard from 'react-copy-to-clipboard'
import { Badge, Overlay, Tooltip } from 'react-bootstrap'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'
import { Copy, Check } from '../../icons'
import { Currency, ChangeDueDate } from '../../components'

const Panel = ({ record, report }) => {
  const [isCopied, setIsCopied] = useState(false)
  const [copyCode, setCopyCode] = useState(null)
  const [isDueChange, setIsDueChange] = useState(false)
  const [isShow, setIsShow] = useState(false)
  const [note, setNote] = useState('')
  const [showFirstName, setShowFirstName] = useState(false)
  const [showSecondName, setShowSecondName] = useState(false)
  const firstNameRef = useRef(null)
  const secondNameRef = useRef(null)
  const lang = i18next.language
  const { t } = useTranslation()

  const copyIdHandler = (_) => {
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 500)
  }

  const copyCodeHandler = (code) => {
    setCopyCode(code)
    setTimeout(() => {
      setCopyCode(null)
    }, 500)
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

  const dateFormat = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }

  const initiatorName = () => {
    if (lang === 'ar') {
      return record.initiator
        ? record.initiator.user.fullNameInArabic
        : record.operation.initiator.fullNameInArabic ||
            record.operation.initiator.user?.fullNameInArabic
    }
    return record.initiator
      ? record.initiator.user.fullNameInEnglish
      : record.operation.initiator.fullNameInEnglish ||
          record.operation.initiator.user?.fullNameInEnglish
  }

  const peerName = () => {
    if (lang === 'ar') {
      return record.peer
        ? record.peer.user.fullNameInArabic
        : record.operation.peer.fullNameInArabic ||
            record.operation.peer.user?.fullNameInArabic
    }
    return record.peer
      ? record.peer.user.fullNameInEnglish
      : record.operation.peer.fullNameInEnglish ||
          record.operation.peer.user?.fullNameInEnglish
  }

  const initiatorType =
    record.initiator?.type || record.operation.initiator.type
  const peerType = record.peer?.type || record.operation.peer.type

  const initiatorCode =
    record.initiator?.user.code ||
    record.operation.initiator.code ||
    record.operation.initiator.user?.code
  const peerCode =
    record.peer?.user.code ||
    record.operation.peer.code ||
    record.operation.peer.user?.code

  const operationValue = (_) => {
    if (record.initiator?.value) return record.initiator.value
    if (record.peer?.value) return record.peer.value
    if (record.credit) return record.credit
    if (record.debt) return record.debt
  }

  const firstNameOverlay = (
    <Overlay target={firstNameRef.current} show={showFirstName} placement='top'>
      {(props) => (
        <Tooltip id='overlay-example-first' {...props}>
          {initiatorName()}
        </Tooltip>
      )}
    </Overlay>
  )

  const secondNameOverlay = (
    <Overlay
      target={secondNameRef.current}
      show={showSecondName}
      placement='top'
    >
      {(props) => (
        <Tooltip id='overlay-example-second' {...props}>
          {peerName()}
        </Tooltip>
      )}
    </Overlay>
  )

  useEffect(() => {
    setNote(record.note || record.operation?.note)
  }, [])
  return (
    <>
      <ChangeDueDate
        isDueChange={isDueChange}
        setIsDueChange={setIsDueChange}
        id={record?._id}
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
            <span>
              {new Date(record.createdAt).toLocaleDateString(
                'en-US',
                dateFormat
              )}
            </span>
            {record.state && (
              <span
                style={{
                  backgroundColor: getStateColor(record.state),
                  textTransform: 'uppercase',
                }}
              >
                {t(record.state)}
              </span>
            )}
          </div>
        </div>
        <div className={style.panel__body}>
          <div className={style.panel__body_parties}>
            <div
              className={`${style.panel__body_name} ${
                lang === 'ar' ? style.panel__body_name_ar : ''
              }`}
            >
              <p
                ref={firstNameRef}
                onClick={() => setShowFirstName(!showFirstName)}
              >
                {initiatorName()?.substring(0, 15) + '...'}
                <span
                  className={`${style.panel__label} ${
                    lang === 'ar' ? style.panel__label_ar : ''
                  }`}
                  style={{
                    backgroundColor:
                      initiatorType === 'debt' ? '#198754' : '#1a374d',
                  }}
                >
                  {t(initiatorType)}
                </span>
                {firstNameOverlay}
              </p>
              <p>
                <Badge bg='dark'>{initiatorCode}</Badge>
                <CopyToClipboard
                  text={initiatorCode}
                  onCopy={() => copyCodeHandler(initiatorCode)}
                >
                  <span
                    className={`${style.panel__code} ${
                      lang === 'ar' ? style.panel__code_ar : ''
                    }`}
                  >
                    {copyCode === initiatorCode ? <Check /> : <Copy />}
                  </span>
                </CopyToClipboard>
              </p>
            </div>
            <div
              className={`${style.panel__body_name} ${
                lang === 'ar' ? style.panel__body_name_ar : ''
              }`}
            >
              <p
                ref={secondNameRef}
                onClick={() => setShowSecondName(!showSecondName)}
              >
                {peerName()?.substring(0, 15) + '...'}
                <span
                  className={`${style.panel__label} ${
                    lang === 'ar' ? style.panel__label_ar : ''
                  }`}
                  style={{
                    backgroundColor:
                      peerType === 'debt' ? '#198754' : '#1a374d',
                  }}
                >
                  {t(peerType)}
                </span>
                {secondNameOverlay}
              </p>
              <p>
                <Badge bg='dark'>{peerCode}</Badge>
                <CopyToClipboard
                  text={peerCode}
                  onCopy={() => copyCodeHandler(peerCode)}
                >
                  <span
                    className={`${style.panel__code} ${
                      lang === 'ar' ? style.panel__code_ar : ''
                    }`}
                  >
                    {copyCode === peerCode ? <Check /> : <Copy />}
                  </span>
                </CopyToClipboard>
              </p>
            </div>
          </div>
          <div className={style.panel__body_data}>
            <div
              className={`${style.panel__body_value} ${
                lang === 'ar' ? style.panel__body_value_ar : ''
              }`}
            >
              <h3>{operationValue()}</h3>
              {<Currency currency={record.currency} inline noName />}
            </div>
            <div
              className={`${style.panel__body_date} ${
                lang === 'ar' ? style.panel__body_date_ar : ''
              }`}
            >
              {record.paymentDate ? (
                <>
                  {t('payment-date')}:
                  <p>
                    <span>
                      {new Date(record.paymentDate).toLocaleDateString(
                        'en-US',
                        dateFormat
                      )}
                    </span>
                  </p>
                </>
              ) : (
                <>
                  {t('due-date')}:
                  {record.dueDate ? (
                    <p>
                      <span
                        className={report ? style.panel__dueDate : ''}
                        onClick={() => report && setIsDueChange(true)}
                      >
                        {new Date(record.dueDate).toLocaleDateString(
                          'en-US',
                          dateFormat
                        )}
                      </span>
                    </p>
                  ) : (
                    <Badge
                      bg='dark'
                      style={{
                        margin: lang === 'ar' ? '0 0.5rem 0 0' : '0 0 0 0.5rem',
                      }}
                    >
                      N/A
                    </Badge>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        {note && (
          <div
            className={`${style.panel__note} ${
              isShow ? style.panel__note_show : ''
            }`}
            Content
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
