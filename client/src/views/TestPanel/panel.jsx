import React, { useState } from 'react'
import style from './style.module.scss'
import CopyToClipboard from 'react-copy-to-clipboard'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Badge } from 'react-bootstrap'
import parser from 'html-react-parser'
import { Copy, Check, LockOpen, Eye } from '../../icons'
import { Loader } from '../../components'

const Panel = ({ user }) => {
  const [isCopied, setIsCopied] = useState(false)
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

  //   const parseHTMLBody = _ => {
  //     const text = parser(ticket.body.substring(0,75) + '....')
  //     return text
  //  }

  return (
    <>
      <div className={style.container}>
        <div className={style.panel}>
          <div className={style.panel__header}>
            <div
              className={`${style.panel__header_id} ${
                lang === 'ar' ? style.panel__header_id_ar : ''
              }`}
            >
              <CopyToClipboard text={'TK-O1A8I7W1G0B6'} onCopy={copyIdHandler}>
                <span>{isCopied ? <Check /> : <Copy />}</span>
              </CopyToClipboard>
              <span>{`#TK-O1A8I7W1G0B6`}</span>
            </div>
            <div
              className={`${style.panel__header_state} ${
                lang === 'ar' ? style.panel__header_state_ar : ''
              }`}
            >
              <Badge bg='success'>in progress</Badge>
              <span>
                <Eye />
              </span>
              {false ? (
                <Loader size='4' options={{ animation: 'border' }} />
              ) : (
                <span style={{ color: 'green' }}>
                  <LockOpen />
                </span>
              )}
            </div>
          </div>
          <div className={style.panel__body}>
            <h3>Lorem ipsum dolor sit amet consectetur adipisicing elit.</h3>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Beatae
              ut autem labore perferendis dolorem praesentium quisquam. Ullam
              enim illum quasi omnis minus inventore maxime esse itaque aut
              similique. Veniam, possimus.
            </p>
          </div>
          <div
            className={`${style.panel__date} ${
              lang === 'ar' ? style.panel__date_ar : ''
            }`}
          >
            <p>
              Created At:
              <em> 02/06/2145</em>
            </p>
            <p>-</p>
            <p>
              Last Updated:
              <em> since 4 min</em>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Panel
