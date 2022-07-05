import React, { useState } from 'react'
import style from './style.module.scss'
import CopyToClipboard from 'react-copy-to-clipboard'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'
import { Badge } from 'react-bootstrap'
import { Copy, Check, Edit, Trash, Link } from '../../icons'
import { Loader } from '../../components'

const Panel = () => {
  const [isCopied, setIsCopied] = useState(false)
  const lang = i18next.language
  const { t } = useTranslation()

  const copyIdHandler = (_) => {
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 500)
  }

  const title = `Lorem ipsum dolor sit amet consectetur adipisicing elit.
  Deleniti quidem sequi perspiciatis eum facere maiores.`
  const body = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam
  quidem, ratione dolorem eaque in odit numquam maiores nemo
  molestiae repellendus qui incidunt, error nisi tempora quisquam
  nulla hic saepe quaerat?`
  return (
    <>
      <div className={style.container}>
        <div className={style.panel}>
          <div className={style.panel__header}>
            <div className={style.panel__header_id}>
              <CopyToClipboard text={'AAE592363'} onCopy={copyIdHandler}>
                <span>{isCopied ? <Check /> : <Copy />}</span>
              </CopyToClipboard>
              <span>{`#AAE592363`}</span>
            </div>
            <div className={style.panel__header_state}>
              <span>
                <Edit />
              </span>
              {false ? (
                <Loader size='4' options={{ animation: 'border' }} />
              ) : (
                <span>
                  <Trash />
                </span>
              )}
            </div>
          </div>
          <div className={style.panel__body}>
            <figure
              className={`${style.panel__body_photo} ${
                lang === 'ar' ? style.panel__body_photo_ar : ''
              }`}
            >
              <img src='/images/photos/photo-1.jpg' alt='second peer' />
            </figure>
            <div
              className={`${style.panel__body_content} ${
                lang === 'ar' ? style.panel__body_content_ar : ''
              }`}
            >
              <h3>{title.substring(0, 80) + '...'}</h3>
              <p>{body.substring(0, 120) + '...'}</p>
              <div
                className={`${style.panel__body_date} ${
                  lang === 'ar' ? style.panel__body_date_ar : ''
                }`}
              >
                <p>
                  <span>Created At: </span>
                  <em>02/06/1958</em>
                </p>
                <p>-</p>
                <p>
                  <span>
                    <Link />
                  </span>
                  {/* <Badge bg='dark'>N/A</Badge> */}
                  <em>0</em>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Panel
