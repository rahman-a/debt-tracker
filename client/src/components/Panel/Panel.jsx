// @ts-nocheck
import React, { useState, useEffect } from 'react'
import style from './style.module.scss'
import CopyToClipboard from 'react-copy-to-clipboard'
import { Badge } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import Decision from './Decision'
import ChatComponent from './Chat'
import {
  panelBodyDateClasses,
  panelBodyNameClasses,
  panelBodyValueClasses,
  panelNoteClasses,
  panelCloseClasses,
  panelBodyPhotoClasses,
} from './classes'
import {
  getUserData,
  getMemberName,
  getPeerId,
  getStateColor,
  isCurrentUserPeer,
  isCurrentUserCredit,
  formatFineAmount,
  peerType,
  // defineValue,
  formatPaymentDate,
} from '@/src/utils/table'
import { Copy, Check, HandshakeSlash, FineIcon } from '@/src/icons'
import { Currency, CloseReport, ChangeDue, PayFine } from '@/src/components'

const Panel = ({ record, reports, due, op, closed }) => {
  const [isCopied, setIsCopied] = useState(false)
  const [isDueChange, setIsDueChange] = useState(false)
  const [isReportClose, setIsReportClose] = useState(false)
  const [isDecision, setIsDecision] = useState(false)
  const [isShow, setIsShow] = useState(false)
  const [isFine, setIsFine] = useState(false)
  const [note, setNote] = useState('')
  const [userId, setUserId] = useState(null)
  const { id } = useParams()
  const { user } = useSelector((state) => state.isAuth)
  const lang = i18next.language
  const { t } = useTranslation()
  const isCredit = isCurrentUserCredit(record, op, userId)
  const isPeer = isCurrentUserPeer(record, userId)
  const memberName = getMemberName(record, userId, lang)
  const peer_Type = peerType(record, userId)
  const peer_Id = getPeerId(record, userId)
  // const creditorData = getUserData(record, 'credit')
  const debtorData = getUserData(record, 'debt')
  // const creditValue = defineValue(record, peer_Type, 'credit')
  // const debtValue = defineValue(record, peer_Type, 'debt')
  const fineAmount = formatFineAmount(debtorData.delayedFine)
  const finePaymentDate = formatPaymentDate(debtorData.delayedFine?.paidAt)
  const reportPaymentDate = formatPaymentDate(record.paymentDate)

  const copyIdHandler = (_) => {
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 500)
  }

  useEffect(() => {
    setNote(record?.note || record?.operation?.note)
  }, [record])

  useEffect(() => {
    id ? setUserId(id) : setUserId(user._id)
  }, [id])
  return (
    <>
      <PayFine
        isFine={isFine}
        setIsFine={setIsFine}
        fine={{
          amount: debtorData.delayedFine?.amount,
          report: debtorData.delayedFine?.report,
          currency: record.currency.abbr,
        }}
      />
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
            {!id && <ChatComponent id={peer_Id} />}
            {reports && !record.paymentDate ? (
              <span
                style={{ backgroundColor: 'darkgreen', color: '#fff' }}
                className={panelCloseClasses(isCredit, id)}
                onClick={() => isCredit && !id && setIsReportClose(true)}
              >
                {t('complete-payment')}
                <HandshakeSlash style={{ marginLeft: '0.5rem' }} />
              </span>
            ) : reports && record.paymentDate ? (
              <Badge bg='success' style={{ color: '#fff' }}>
                paidAt: {reportPaymentDate}
              </Badge>
            ) : (
              <span
                style={{
                  backgroundColor: getStateColor(record.state),
                  textTransform: 'uppercase',
                }}
                className={
                  (record.state === 'pending' && !isPeer) || id
                    ? style.panel__disabled
                    : ''
                }
                onClick={() =>
                  record.state === 'pending' &&
                  isPeer &&
                  !id &&
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
            className={panelBodyPhotoClasses}
            style={{
              backgroundColor: isPeer
                ? record.initiator?.user?.color ||
                  record.operation.initiator.color
                : record.peer?.user?.color || record.operation.peer.color,
            }}
          >
            <img
              src={
                isPeer
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
            <div className={panelBodyNameClasses}>
              <p>{memberName?.substring(0, 25) + '...'}</p>
              <span
                className={style.panel__label}
                style={{
                  backgroundColor: peer_Type === 'debt' ? '#198754' : '#1a374d',
                }}
              >
                {isPeer
                  ? t(record.initiator?.type) ||
                    t(record.operation.initiator.type)
                  : t(record.peer?.type) || t(record.operation.peer.type)}
              </span>
            </div>
            <div className={style.panel__body_money}>
              <div className={panelBodyValueClasses}>
                <h3>
                  {record.peer?.value ||
                    (record.debt > 0 ? record.debt : record.credit)}
                </h3>
                {<Currency currency={record.currency} inline noName />}
              </div>
              {fineAmount && !isCredit && (
                <div
                  onClick={() => !finePaymentDate && !id && setIsFine(true)}
                  style={{
                    color: finePaymentDate ? 'green' : 'red',
                    cursor: finePaymentDate || id ? 'default' : 'pointer',
                  }}
                  title={
                    finePaymentDate
                      ? `Fine has been paid at ${finePaymentDate}`
                      : id
                      ? fineAmount
                      : 'click to pay the delayed fine'
                  }
                  className={panelBodyValueClasses}
                >
                  <FineIcon width='3.5rem' height='3.5rem' />
                  {finePaymentDate ? (
                    <Badge bg='success'>{finePaymentDate}</Badge>
                  ) : (
                    <h3>{fineAmount}</h3>
                  )}
                </div>
              )}
            </div>
            <div className={panelBodyDateClasses}>
              {t('due-date')}:
              <p>
                {record.paymentDate ? (
                  <span>
                    {new Date(record.paymentDate).toLocaleDateString()}
                  </span>
                ) : record.dueDate ? (
                  <span
                    className={isCredit && !id ? style.panel__due : ''}
                    onClick={() => isCredit && !id && setIsDueChange(true)}
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
          <div className={panelNoteClasses(isShow)}>
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
