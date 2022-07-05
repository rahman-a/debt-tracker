import React, { useState } from 'react'
import style from './style.module.scss'
import CopyToClipboard from 'react-copy-to-clipboard'
import i18next from 'i18next'
import { Copy, Check, Edit, Trash, Eye } from '../../icons'
import { Loader } from '../../components'
import DeleteArticle from './DeleteArticle'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Badge } from 'react-bootstrap'

const Panel = ({ article }) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const navigate = useNavigate()
  const { t } = useTranslation()
  const lang = i18next.language

  const copyIdHandler = (_) => {
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 500)
  }

  const dateOptions = {
    month: 'long',
    year: 'numeric',
    day: 'numeric',
  }

  return (
    <>
      <DeleteArticle
        confirmDelete={confirmDelete}
        setConfirmDelete={setConfirmDelete}
        setIsDeleting={setIsDeleting}
        id={article._id}
      />
      <div className={style.panel}>
        <div className={style.panel__header}>
          <div className={style.panel__header_id}>
            <CopyToClipboard text={article._id} onCopy={copyIdHandler}>
              <span>{isCopied ? <Check /> : <Copy />}</span>
            </CopyToClipboard>
            <Badge bg='dark'>{`#${article._id}`}</Badge>
          </div>
          <div className={style.panel__header_state}>
            <span onClick={() => navigate(`/articles/${article._id}`)}>
              <Edit />
            </span>
            {isDeleting ? (
              <Loader size='4' options={{ animation: 'border' }} />
            ) : (
              <span onClick={() => setConfirmDelete(true)}>
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
            <img
              src={`/api/files/${article.image}`}
              alt={article.title[lang]}
            />
          </figure>
          <div className={style.panel__body_data}>
            <div
              className={`${style.panel__body_title} ${
                lang === 'ar' ? style.panel__body_title_ar : ''
              }`}
            >
              {article.title[lang].substring(0, 80)}
            </div>
            <div
              className={`${style.panel__body_date} ${
                lang === 'ar' ? style.panel__body_date_ar : ''
              }`}
            >
              <p>
                <span>{t('createdAt')}: </span>
                <em>
                  {new Date(article.createdAt).toLocaleDateString(
                    'en-US',
                    dateOptions
                  )}
                </em>
              </p>
              <p>-</p>
              <p>
                <span>
                  <Eye />
                </span>
                <em>{article.views}</em>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Panel
