import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import { useSelector, useDispatch } from 'react-redux'
import { Modal, Button, Badge } from 'react-bootstrap'
import actions from '../../actions'
import { Eye, Times, Reader, Edit } from '../../icons'
import { Loader, Note } from '../../components'
import UpdateNews from './/UpdateNews'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'

const Row = ({ news, idx }) => {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isImage, setIsImage] = useState(false)
  const [isTextOn, setIsTextOn] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const dispatch = useDispatch()
  const { message } = useSelector((state) => state.deleteContent)
  const lang = i18next.language
  const { t } = useTranslation()

  const confirmDeleteSliderHandler = (_) => {
    setIsDeleting(true)
    setConfirmDelete(false)
    setTimeout(() => {
      dispatch(actions.content.deleteContent(news._id))
    }, 500)
  }
  const initiateDeleteProcess = (_) => {
    setConfirmDelete(true)
  }

  const asset = {
    en: 'news',
    ar: 'الخبر',
  }

  const dateOptions = {
    month: 'long',
    year: 'numeric',
    day: 'numeric',
  }

  useEffect(() => {
    message && setIsDeleting(false)
  }, [message])

  return (
    <>
      <Modal show={confirmDelete} onHide={() => setConfirmDelete(false)}>
        <Modal.Body>
          <p className={style.news__confirmDelete} style={{ fontSize: '2rem' }}>
            {' '}
            {t('are-you-sure')}
          </p>
          <p className={style.news__confirmDelete}>
            {t('confirm-delete-notice', { asset: asset[lang] })}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='info'
            size='lg'
            onClick={() => setConfirmDelete(false)}
          >
            {t('cancel-btn')}
          </Button>
          <Button
            variant='danger'
            size='lg'
            onClick={confirmDeleteSliderHandler}
          >
            {t('confirm-btn', { asset: asset[lang] })}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={isImage} onHide={() => setIsImage(false)} fullscreen={true}>
        <Modal.Header>
          <Modal.Title> {t('image')} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            style={{ width: '100%', height: '100%' }}
            src={`/api/files/${news.image}`}
            alt='slider'
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ marginRight: '2rem' }}
            variant='secondary'
            size='lg'
            onClick={() => setIsImage(false)}
          >
            {t('close')}
          </Button>
        </Modal.Footer>
      </Modal>

      <Note
        isNoteOn={isTextOn}
        setIsNoteOn={setIsTextOn}
        note={news.body[lang]}
        title='news-text'
      />

      <UpdateNews
        isUpdateNews={isEdit}
        setIsUpdateNews={setIsEdit}
        news={news}
      />

      {
        <>
          <td>{idx + 1}</td>

          <td style={{ padding: news.body ? '0' : '2.5rem 0' }}>
            {news.body ? (
              <p className={style.news__note}>
                <span onClick={() => setIsTextOn(true)}>
                  <Reader />
                </span>
                <i style={{ lineBreak: 'anywhere', padding: '0 0.8rem' }}>
                  {news.body[lang]?.substring(0, 35) + '...'}
                </i>
              </p>
            ) : (
              'N/A'
            )}
          </td>

          <td>
            {news.name ? (
              news.name[lang]
            ) : (
              <Badge bg='secondary'>{t('not-available')}</Badge>
            )}
          </td>

          <td style={{ padding: news.image ? '0' : '2.5rem 0' }}>
            {news.image ? (
              <p className={style.news__image}>
                <span onClick={() => setIsImage(true)}>
                  <Eye />
                </span>
                <img src={`/api/files/${news.image}`} alt='slider' />
              </p>
            ) : (
              <Badge bg='secondary'>{t('not-available')}</Badge>
            )}
          </td>

          <td>
            {' '}
            {new Date(news.createdAt).toLocaleDateString(
              'en-US',
              dateOptions
            )}{' '}
          </td>
          <td className={style.news__action}>
            <span
              className={style.news__delete}
              style={{ position: 'relative' }}
            >
              {isDeleting ? (
                <Loader size='4' center options={{ animation: 'border' }} />
              ) : (
                <span
                  style={{ cursor: 'pointer' }}
                  onClick={initiateDeleteProcess}
                >
                  <Times />
                </span>
              )}
            </span>
            <span className={style.news__edit} style={{ position: 'relative' }}>
              <span
                style={{ cursor: 'pointer' }}
                onClick={() => setIsEdit(true)}
              >
                <Edit />
              </span>
            </span>
          </td>
        </>
      }
    </>
  )
}

export default Row
