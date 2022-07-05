import React, { useEffect } from 'react'
import style from './style.module.scss'
import { Modal, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { useDispatch, useSelector } from 'react-redux'
import actions from '../../actions'

const Delete = ({ toggleDelete, setToggleDelete, setIsDeleting, id }) => {
  const dispatch = useDispatch()
  const { message, error } = useSelector((state) => state.deleteUser)
  const { t } = useTranslation()
  const lang = i18next.language

  const confirmDeleteUser = () => {
    setToggleDelete(false)
    setIsDeleting(true)
    setTimeout(() => {
      dispatch(actions.admin.deleteUser(id))
    }, 500)
  }

  useEffect(() => {
    ;(message || error) && setIsDeleting(false)
  }, [message, error])

  return (
    <Modal show={toggleDelete} onHide={() => setToggleDelete(false)}>
      <Modal.Body>
        <div className={style.panel__delete}>
          <h2>{t('are-you-sure')}</h2>
          <p>
            {t('confirm-delete-notice', {
              asset: lang === 'ar' ? 'العضو' : 'member',
            })}
          </p>
          <p>{t('undone-process')}</p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => setToggleDelete(false)}
          variant='success'
          size='lg'
        >
          {t('cancel-btn')}
        </Button>
        <Button variant='danger' size='lg' onClick={confirmDeleteUser}>
          {t('confirm-btn', { asset: lang === 'ar' ? 'العضو' : 'member' })}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default Delete
