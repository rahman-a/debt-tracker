import React, { useState } from 'react'
import style from './style.module.scss'
import { Badge } from 'react-bootstrap'
import CopyToClipboard from 'react-copy-to-clipboard'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import classnames from 'classnames'
import ChangeDueDate from './ChangeDueDate'
import { Currency, Note } from '@/src/components'
import { Check, Copy, Reader } from '@/src/icons'

const Row = ({ report, idx, due }) => {
  const [isDueChange, setIsDueChange] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [isNoteOn, setIsNoteOn] = useState(false)
  const [copyCode, setCopyCode] = useState(null)
  const { t } = useTranslation()
  const lang = i18next.language

  const dateFormat = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }
  const reportsCodeClasses = classnames(style.reports__code, {
    [style.reports__code_ar]: lang === 'ar',
  })
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

  const initiatorName =
    lang === 'ar'
      ? report.operation.initiator.fullNameInArabic ||
        report.operation.initiator.user?.fullNameInArabic
      : report.operation.initiator.fullNameInEnglish ||
        report.operation.initiator.user?.fullNameInEnglish
  const peerName =
    lang === 'ar'
      ? report.operation.peer.fullNameInArabic ||
        report.operation.peer.user?.fullNameInArabic
      : report.operation.peer.fullNameInEnglish ||
        report.operation.peer.user?.fullNameInEnglish

  return (
    <>
      <Note
        isNoteOn={isNoteOn}
        setIsNoteOn={setIsNoteOn}
        note={report.operation.note}
      />

      <ChangeDueDate
        isDueChange={isDueChange}
        setIsDueChange={setIsDueChange}
        id={report._id}
      />

      <tr>
        <td> {idx + 1} </td>

        <td className={style.reports__id}>
          <CopyToClipboard text={report._id} onCopy={copyIdHandler}>
            <span>{isCopied ? <Check /> : <Copy />}</span>
          </CopyToClipboard>
          {report._id?.substring(0, 12) + '...'}
        </td>

        <td style={{ padding: '0' }}>
          <div className={style.reports__party}>
            <span
              className={style.reports__label}
              style={{
                backgroundColor:
                  report.operation.initiator.type === 'debt'
                    ? '#198754'
                    : '#1a374d',
              }}
            >
              {t(report.operation.initiator.type)}
            </span>
            <span title={initiatorName}>
              {initiatorName?.substring(0, 13) + '...'}
            </span>
            <span>
              <Badge bg='dark'>
                {report.operation.initiator.code ||
                  report.operation.initiator.user?.code}
              </Badge>
              <CopyToClipboard
                text={
                  report.operation.initiator.code ||
                  report.operation.initiator.user?.code
                }
                onCopy={() =>
                  copyCodeHandler(
                    report.operation.initiator.code ||
                      report.operation.initiator.user?.code
                  )
                }
              >
                <span className={reportsCodeClasses}>
                  {copyCode ===
                  (report.operation.initiator.code ||
                    report.operation.initiator.user?.code) ? (
                    <Check />
                  ) : (
                    <Copy />
                  )}
                </span>
              </CopyToClipboard>
            </span>
          </div>
        </td>

        <td style={{ padding: '0' }} className={style.reports__party}>
          <div className={style.reports__party}>
            <span
              className={style.reports__label}
              style={{
                backgroundColor:
                  report.operation.peer.type === 'debt' ? '#198754' : '#1a374d',
              }}
            >
              {t(report.operation.peer.type)}
            </span>
            <span title={peerName}>{peerName?.substring(0, 13) + '...'}</span>
            <span>
              <Badge bg='dark'>
                {report.operation.peer.code || report.operation.peer.user?.code}
              </Badge>
              <CopyToClipboard
                text={
                  report.operation.peer.code || report.operation.peer.user?.code
                }
                onCopy={() =>
                  copyCodeHandler(
                    report.operation.peer.code ||
                      report.operation.peer.user?.code
                  )
                }
              >
                <span className={reportsCodeClasses}>
                  {copyCode ===
                  (report.operation.peer.code ||
                    report.operation.peer.user?.code) ? (
                    <Check />
                  ) : (
                    <Copy />
                  )}
                </span>
              </CopyToClipboard>
            </span>
          </div>
        </td>

        <td>{report.credit ? report.credit : report.debt}</td>

        {/* Operation Description */}
        <td style={{ padding: report.operation.note ? '0' : '2.5rem 0' }}>
          {report.operation.note ? (
            <p className={style.reports__note}>
              <span onClick={() => setIsNoteOn(true)}>
                <Reader />
              </span>
              <i style={{ lineBreak: 'anywhere', padding: '0 0.8rem' }}>
                {report.operation.note?.substring(0, 35) + '...'}
              </i>
            </p>
          ) : (
            'N/A'
          )}
        </td>

        <td>
          <Currency currency={report.currency} />
        </td>

        {due && (
          <td>
            {report.dueDate ? (
              <span
                className={style.reports__dueDate}
                onClick={() => setIsDueChange(true)}
              >
                {new Date(report.dueDate).toLocaleDateString(
                  'en-US',
                  dateFormat
                )}
              </span>
            ) : (
              <Badge bg='success'> N/A </Badge>
            )}
          </td>
        )}

        <td>
          {new Date(report.createdAt).toLocaleDateString('en-US', dateFormat)}
        </td>

        {/* <td style={{padding:0}}>
                <div className={style.reports__actions}>
                <span onClick={() => navigate(`/member/${operation._id}`)}> <Edit/> </span>
                {
                    isDeleting 
                    ? <Loader size='4' options={{animation:'border'}}/>
                    : <span onClick={() => initiateOperationDelete(operation._id)}> <Trash/> </span>
                }
                </div>
            </td> */}
      </tr>
    </>
  )
}

export default Row
