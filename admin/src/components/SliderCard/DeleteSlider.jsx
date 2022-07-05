import React, { useEffect } from 'react'
import style from './style.module.scss'
import { Modal, Button } from 'react-bootstrap'
import actions from '../../actions'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'

const DeleteSlider = ({
  confirmDelete,
  setConfirmDelete,
  setIsDeleting,
  id,
}) => {
  const dispatch = useDispatch()
  const { message } = useSelector((state) => state.deleteSlider)
  const { t } = useTranslation()
  const lang = i18next.language
  const asset = {
    en: 'slider',
    ar: 'السلايدر',
  }
  const confirmDeleteSliderHandler = (_) => {
    setIsDeleting(true)
    setConfirmDelete(false)
    setTimeout(() => {
      dispatch(actions.content.deleteSlider(id))
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
        <Button variant='danger' size='lg' onClick={confirmDeleteSliderHandler}>
          {t('confirm-btn', { asset: asset[lang] })}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default DeleteSlider
