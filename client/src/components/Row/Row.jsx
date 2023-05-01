import React, { useState } from 'react'
import style from './style.module.scss'
import { Badge } from 'react-bootstrap'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { Currency, ChangeDue, Description, CloseReport } from '../../components'
import {
  Copy,
  Check,
  Reader,
  HandshakeSlash,
  Times,
  Chat as ChatIcon,
} from '../../icons'
import Decision from './Decision'
import Chat from './Chat'

const Row = ({ record, idx, reports, due, op, closed }) => {
  const [isCopied, setIsCopied] = useState(false)
  const [isDescribeOn, setIsDescribeOn] = useState(false)
  const [isDueChange, setIsDueChange] = useState(false)
  const [isReportClose, setIsReportClose] = useState(false)
  const { user } = useSelector((state) => state.isAuth)
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

  const defineValue = (type, field) => {
    let value = 0
    if (type === 'credit' && field === 'credit') {
      if (record.credit) {
        value = record.credit
      } else if (record.debt) {
        value = record.debt
      } else if (record.initiator?.value) {
        value = record.initiator?.value
      } else {
        value = record.peer?.value
      }
    } else {
      value = '0.0'
    }

    if (type === 'debt' && field === 'debt') {
      if (record.debt) {
        value = record.debt
      } else if (record.credit) {
        value = record.credit
      } else if (record.initiator?.value) {
        value = record.initiator?.value
      } else {
        value = record.peer?.value
      }
    } else if (field === 'debt') {
      value = '0.0'
    }
    return value
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

  return (
    <>
      <Description
        note={record?.note || record?.operation?.note}
        isDescribeOn={isDescribeOn}
        setIsDescribeOn={setIsDescribeOn}
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

      <tr className={style.row}>
        <td>{idx + 1}</td>

        {/* Operation Id */}
        <td className={style.row__id}>
          <CopyToClipboard text={record._id} onCopy={copyIdHandler}>
            <span>{isCopied ? <Check /> : <Copy />}</span>
          </CopyToClipboard>
          {record._id.substring(0, 12) + '...'}
        </td>

        {/* Operation Second Peer or Initiator Name */}
        <td className={style.row__name}>
          <span
            className={style.row__label}
            style={{
              backgroundColor: peerType() === 'debt' ? '#198754' : '#1a374d',
            }}
          >
            {(record.peer?.user?._id || record.operation.peer._id) === user._id
              ? t(record.initiator?.type) || t(record.operation.initiator.type)
              : t(record.peer?.type) || t(record.operation.peer.type)}
          </span>
          <span className={style.row__chatIcon}>
            <ChatIcon />
          </span>
          <Chat id={getPeerId()} />
          {getMemberName()}
        </td>

        {/* Operation Second Peer or Initiator Photo */}
        <td className={style.row__photo} style={{ padding: '1rem 0' }}>
          <span
            style={{
              backgroundColor:
                (record.peer?.user?._id || record.operation.peer._id) ===
                user._id
                  ? record.initiator?.user?.color ||
                    record.operation.initiator.color
                  : record.peer?.user?.color || record.operation.peer.color,
            }}
          ></span>
          <img
            src={
              (record.peer?.user?._id || record.operation.peer._id) === user._id
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
        </td>

        {/* Operation Description */}
        <td
          style={{
            padding: record?.note || record?.operation?.note ? '0' : '2.5rem 0',
          }}
        >
          {record?.note || record?.operation?.note ? (
            <p className={style.row__desc}>
              <span onClick={() => setIsDescribeOn(true)}>
                <Reader />
              </span>
              <i style={{ lineBreak: 'anywhere', padding: '0 0.8rem' }}>
                {record.note
                  ? record.note?.substring(0, 35) + '...'
                  : record.operation.note.substring(0, 35) + '...'}
              </i>
            </p>
          ) : (
            <Badge bg='dark'>N/A</Badge>
          )}
        </td>

        {/* Creditor amount value*/}
        <td style={{ textTransform: 'capitalize' }}>
          {defineValue(peerType(), 'credit')}
        </td>

        {/* Debtor amount value*/}
        <td> {defineValue(peerType(), 'debt')} </td>

        {/* Operation Currency [usd, euro, aed]*/}
        <td
          style={{
            textAlign: lang === 'ar' ? 'center' : 'start',
            paddingLeft: '1rem',
          }}
        >
          <Currency currency={record.currency} />
        </td>

        {/* Operation State [pending, approved, declined]*/}

        {op && (
          <td
            className={style.row__state}
            style={{
              backgroundColor: getStateColor(record.state),
              textTransform: 'uppercase',
            }}
          >
            {record.state === 'pending' && isCurrentUserPeer() && (
              <>
                <span className={style.row__state_decision}>
                  <Check />
                  <Times />
                </span>
                <Decision id={record._id} />
              </>
            )}
            {t(record.state)}
          </td>
        )}

        {/* Operation Due Date */}
        {(due || closed) && (
          <td
            style={{ backgroundColor: record.paymentDate ? '#FCD4DB' : '#ff' }}
          >
            {record.paymentDate ? (
              new Date(record.paymentDate).toLocaleDateString()
            ) : record.dueDate ? (
              <span
                className={isCurrentUserCredit() ? style.row__due : ''}
                onClick={() => isCurrentUserCredit() && setIsDueChange(true)}
              >
                {new Date(record.dueDate).toLocaleDateString()}
              </span>
            ) : (
              <Badge bg='dark'>N/A</Badge>
            )}
          </td>
        )}
        {reports && (
          <td>
            <span
              className={`${style.row__close} 
                   ${!isCurrentUserCredit() ? style.row__close_disabled : ''}`}
              onClick={() => isCurrentUserCredit() && setIsReportClose(true)}
            >
              <HandshakeSlash />
            </span>
          </td>
        )}
      </tr>
    </>
  )
}

export default Row
