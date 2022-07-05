import React, { useEffect } from 'react'
import style from './style.module.scss'
import { Modal, Button } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import actions from '../../actions'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'

const DeleteArticle = ({
  confirmDelete,
  setConfirmDelete,
  setIsDeleting,
  id,
}) => {
  const lang = i18next.language
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { message } = useSelector((state) => state.deleteArticle)

  const assetName = {
    en: 'Article',
    ar: 'المقالة',
  }

  const confirmDeleteBlogHandler = (_) => {
    setConfirmDelete(false)
    setIsDeleting(true)
    setTimeout(() => {
      dispatch(actions.article.deleteArticle(id))
    }, 500)
  }

  useEffect(() => {
    message && setIsDeleting(false)
  }, [message])

  return (
    <Modal show={confirmDelete} onHide={() => setConfirmDelete(false)}>
      <Modal.Body>
        <p className={style.panel__confirmDelete} style={{ fontSize: '2rem' }}>
          {t('are-you-sure')}
        </p>
        <p className={style.panel__confirmDelete}>
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
  )
}

export default DeleteArticle
