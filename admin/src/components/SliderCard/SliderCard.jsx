import React, { useState } from 'react'
import style from './style.module.scss'
import CopyToClipboard from 'react-copy-to-clipboard'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'
import { Badge } from 'react-bootstrap'
import { Copy, Check, Edit, Trash, Link } from '../../icons'
import { Loader } from '../../components'
import { useNavigate } from 'react-router-dom'
import DeleteSlider from './DeleteSlider'
import SlideImage from './SlideImage'
import UpdateSlider from '../Slider/UpdateSlider'

const Panel = ({ slide }) => {
  const [isCopied, setIsCopied] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isImage, setIsImage] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const navigate = useNavigate()
  const lang = i18next.language
  const { t } = useTranslation()

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
      <DeleteSlider
        confirmDelete={confirmDelete}
        setConfirmDelete={setConfirmDelete}
        setIsDeleting={setIsDeleting}
        id={slide._id}
      />
      <SlideImage
        isImage={isImage}
        setIsImage={setIsImage}
        image={slide.image}
      />
      <UpdateSlider
        isUpdateSlide={isEdit}
        setIsUpdateSlide={setIsEdit}
        slide={slide}
      />
      <div className={style.panel}>
        <div className={style.panel__header}>
          <div className={style.panel__header_id}>
            <CopyToClipboard text={slide._id} onCopy={copyIdHandler}>
              <span>{isCopied ? <Check /> : <Copy />}</span>
            </CopyToClipboard>
            <Badge bg='dark'>{`#${slide._id}`}</Badge>
          </div>
          <div className={style.panel__header_state}>
            <span onClick={() => setIsEdit(true)}>
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
            onClick={() => setIsImage(true)}
            className={`${style.panel__body_photo} ${
              lang === 'ar' ? style.panel__body_photo_ar : ''
            }`}
          >
            <img src={`/api/files/${slide.image}`} alt='slider' />
          </figure>
          <div
            className={`${style.panel__body_content} ${
              lang === 'ar' ? style.panel__body_content_ar : ''
            }`}
          >
            <h3>{slide.title[lang].substring(0, 80) + '...'}</h3>
            <p>
              {slide.text ? (
                slide.text[lang].substring(0, 120) + '...'
              ) : (
                <Badge bg='dark'>N/A</Badge>
              )}
            </p>
            <div
              className={`${style.panel__body_date} ${
                lang === 'ar' ? style.panel__body_date_ar : ''
              }`}
            >
              <p>
                <span>{t('createdAt')}: </span>
                <em>
                  {new Date(slide.createdAt).toLocaleDateString(
                    'en-US',
                    dateOptions
                  )}
                </em>
              </p>
              <p>-</p>
              <p>
                <span>
                  <Link />
                </span>
                {slide.article?.title[lang] ? (
                  <em
                    onClick={() => navigate(`/articles/${slide.article._id}`)}
                  >
                    {slide.article.title[lang].substring(0, 20) + '...'}
                  </em>
                ) : (
                  <Badge variant='secondary'>N/A</Badge>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Panel
