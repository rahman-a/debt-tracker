import React, { useState } from 'react'
import style from './style.module.scss'
import CopyToClipboard from 'react-copy-to-clipboard'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Badge } from 'react-bootstrap'
import parser from 'html-react-parser'
import CloseTicket from './CloseTicket'
import { Copy, Check, LockOpen, Eye, Lock } from '@/src/icons'
import { Loader } from '@/src/components'
import msToTime from '@/src/config/msToTime'

const Panel = ({ ticket }) => {
  const [isCopied, setIsCopied] = useState(false)
  const [toggleClose, setToggleClose] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const lang = i18next.language
  const { t } = useTranslation()
  const navigate = useNavigate()

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

  const initiateCloseTicket = (_) => {
    if (ticket.isOpen) {
      setToggleClose(true)
    }
  }

  const parseHTMLBody = (_) => {
    const text = parser(ticket.body.substring(0, 150) + '....')
    return text
  }

  return (
    <>
      <CloseTicket
        toggleClose={toggleClose}
        setToggleClose={setToggleClose}
        setIsClosing={setIsClosing}
        id={ticket._id}
      />
      <div className={style.panel}>
        <div className={style.panel__header}>
          <div
            className={`${style.panel__header_id} ${
              lang === 'ar' ? style.panel__header_id_ar : ''
            }`}
          >
            <CopyToClipboard text={ticket.code} onCopy={copyIdHandler}>
              <span>{isCopied ? <Check /> : <Copy />}</span>
            </CopyToClipboard>
            <Badge bg='dark'>{`#${ticket.code}`}</Badge>
          </div>
          <div
            className={`${style.panel__header_state} ${
              lang === 'ar' ? style.panel__header_state_ar : ''
            }`}
          >
            {ticket.isOpen ? (
              <Badge bg='success'>{t('open')}</Badge>
            ) : (
              <Badge bg='danger'>{t('closed')}</Badge>
            )}
            <span onClick={() => navigate(`/ticket/${ticket._id}`)}>
              <Eye />
            </span>
            {isClosing ? (
              <Loader size='4' options={{ animation: 'border' }} />
            ) : (
              <span onClick={initiateCloseTicket}>
                {ticket.isOpen ? <LockOpen fill='green' /> : <Lock />}
              </span>
            )}
          </div>
        </div>
        <div className={style.panel__member}>
          <figure
            className={`${style.panel__member_photo} ${
              lang === 'ar' ? style.panel__member_photo_ar : ''
            }`}
          >
            <img src={`/api/files/${ticket.member.avatar}`} alt='member' />
          </figure>
          <div className={style.panel__member_data}>
            <div
              className={`${style.panel__member_name} ${
                lang === 'ar' ? style.panel__member_name_ar : ''
              }`}
            >
              <p onClick={() => navigate(`/member/${ticket.member._id}`)}>
                {lang === 'ar'
                  ? ticket.member.fullNameInArabic
                  : ticket.member.fullNameInEnglish}
              </p>
            </div>
            <div
              className={`${style.panel__member_date} ${
                lang === 'ar' ? style.panel__member_date_ar : ''
              }`}
            >
              <p>
                <span>{ticket.member.email.email}</span>
              </p>
            </div>
          </div>
        </div>
        <div className={style.panel__body}>
          <h3 onClick={() => navigate(`/ticket/${ticket._id}`)}>
            {ticket.title}
          </h3>
          <p>{parseHTMLBody()}</p>
        </div>
        <div
          className={`${style.panel__date} ${
            lang === 'ar' ? style.panel__date_ar : ''
          }`}
        >
          <p>
            {t('createdAt')}: &nbsp;
            <em>
              {new Date(ticket.createdAt).toLocaleDateString(
                'en-US',
                dateFormat
              )}
            </em>
          </p>
          <p>-</p>
          <p>
            {t('last-updated')}: &nbsp;
            <em>
              {msToTime(
                new Date().getTime() - new Date(ticket.updatedAt).getTime(),
                lang
              )}
            </em>
          </p>
        </div>
      </div>
    </>
  )
}

export default Panel
