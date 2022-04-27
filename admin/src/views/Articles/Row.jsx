import React, { useState, useEffect } from 'react'
import { Modal, Button, Badge } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import style from './style.module.scss'
import { Times, Check, Copy, Edit } from '../../icons'
import { Loader } from '../../components'
import actions from '../../actions'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'

const Row = ({ article, idx }) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { message } = useSelector((state) => state.deleteArticle)
  const lang = i18next.language
  const { t } = useTranslation()

  const dateOptions = {
    month: 'long',
    year: 'numeric',
    day: 'numeric',
  }

  const copyIdHandler = (_) => {
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 500)
  }

  const initiateDeleteProcess = (_) => {
    setConfirmDelete(true)
  }

  const assetName = {
    en: 'Article',
    ar: 'المقالة',
  }

  const confirmDeleteBlogHandler = (_) => {
    setConfirmDelete(false)
    setIsDeleting(true)
    setTimeout(() => {
      dispatch(actions.article.deleteArticle(article._id))
    }, 500)
  }

  useEffect(() => {
    message && setIsDeleting(false)
  }, [message])

  return (
    <>
      <Modal show={confirmDelete} onHide={() => setConfirmDelete(false)}>
        <Modal.Body>
          <p
            className={style.articles__confirmDelete}
            style={{ fontSize: '2rem' }}
          >
            {' '}
            {t('are-you-sure')}
          </p>
          <p className={style.articles__confirmDelete}>
            {t('confirm-delete-notice', { asset: assetName[lang] })}
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
          <Button variant='danger' size='lg' onClick={confirmDeleteBlogHandler}>
            {t('confirm-btn', { asset: assetName[lang] })}
          </Button>
        </Modal.Footer>
      </Modal>

      {
        <>
          <td>{idx + 1}</td>
          <td className='row-id'>
            <CopyToClipboard text={article._id} onCopy={copyIdHandler}>
              <span>{isCopied ? <Check /> : <Copy />}</span>
            </CopyToClipboard>
            {article._id.substring(0, 12) + '...'}
          </td>
          <td style={{ padding: '1.6rem' }} title={article.title}>
            {article.title.substring(0, 50)}
          </td>
          <td>
            <img
              className='row-photo'
              src={`/api/files/${article.image}`}
              alt={article.title}
            />
          </td>
          <td>
            {article.views === 0 ? (
              <Badge bg='dark'> {t('no-views')} </Badge>
            ) : (
              article.views
            )}
          </td>
          <td>
            {new Date(article.createdAt).toLocaleDateString(
              'en-US',
              dateOptions
            )}
          </td>
          <td className={style.articles__action}>
            <span
              className={style.articles__delete}
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
              className={style.articles__edit}
              style={{ position: 'relative' }}
            >
              <span
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/articles/${article._id}`)}
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
