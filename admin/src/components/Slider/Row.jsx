import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Modal, Button, Badge } from 'react-bootstrap'
import actions from '../../actions'
import { Eye, Times, Reader, Edit } from '../../icons'
import { Loader, Note } from '../../components'
import UpdateSlider from './UpdateSlider'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'

const Row = ({ slide, idx }) => {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isImage, setIsImage] = useState(false)
  const [isTextOn, setIsTextOn] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const dispatch = useDispatch()
  const { message } = useSelector((state) => state.deleteSlider)
  const navigate = useNavigate()
  const lang = i18next.language
  const { t } = useTranslation()

  const confirmDeleteSliderHandler = (_) => {
    setIsDeleting(true)
    setConfirmDelete(false)
    setTimeout(() => {
      dispatch(actions.content.deleteSlider(slide._id))
    }, 500)
  }
  const initiateDeleteProcess = (_) => {
    setConfirmDelete(true)
  }

  const asset = {
    en: 'slider',
    ar: 'السلايدر',
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
          <p
            className={style.slider__confirmDelete}
            style={{ fontSize: '2rem' }}
          >
            {' '}
            {t('are-you-sure')}
          </p>
          <p className={style.slider__confirmDelete}>
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
          <Modal.Title> {t('slider-image')} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            style={{ width: '100%', height: '100%' }}
            src={`/api/files/${slide.image}`}
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
        note={slide.text[lang]}
        title='slider-text'
      />

      <UpdateSlider
        isUpdateSlide={isEdit}
        setIsUpdateSlide={setIsEdit}
        slide={slide}
      />

      {
        <>
          <td>{idx + 1}</td>

          <td style={{ padding: '1rem 0' }} title={slide.title[lang]}>
            {' '}
            {slide.title[lang].substring(0, 75)}{' '}
          </td>

          <td style={{ padding: slide.text ? '0' : '2.5rem 0' }}>
            {slide.text ? (
              <p className={style.slider__note}>
                <span onClick={() => setIsTextOn(true)}>
                  <Reader />
                </span>
                <i style={{ lineBreak: 'anywhere', padding: '0 0.8rem' }}>
                  {slide.text[lang]?.substring(0, 35) + '...'}
                </i>
              </p>
            ) : (
              'N/A'
            )}
          </td>

          <td style={{ padding: '0' }}>
            <p className={style.slider__image}>
              <span onClick={() => setIsImage(true)}>
                <Eye />
              </span>
              <img src={`/api/files/${slide.image}`} alt='slider' />
            </p>
          </td>

          <td>
            {slide.article?.title ? (
              <span
                className={style.slider__item}
                onClick={() => navigate(`/articles/${slide.article._id}`)}
              >
                {slide.article.title.substring(0, 35) + '...'}
              </span>
            ) : (
              <Badge variant='secondary'>N/A</Badge>
            )}
          </td>

          <td>
            {' '}
            {new Date(slide.createdAt).toLocaleDateString(
              'en-US',
              dateOptions
            )}{' '}
          </td>
          <td className={style.slider__action}>
            <span
              className={style.slider__delete}
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
            <span
              className={style.slider__edit}
              style={{ position: 'relative' }}
            >
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
