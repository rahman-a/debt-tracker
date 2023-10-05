import React from 'react'
import style from './style.module.scss'
import { Modal, Button } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import actions from '@/src/actions'
const DeleteEmployee = ({ id, toggleDelete, setToggleDelete }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const lang = i18next.language
  const confirmDeleteUser = (_) => {
    dispatch(actions.employees.deleteEmployee(id))
    setToggleDelete(false)
  }
  return (
    <Modal show={toggleDelete} onHide={() => setToggleDelete(false)}>
      <Modal.Body>
        <div className={style.actions__delete}>
          <h2>{t('are-you-sure')}</h2>
          <p>
            {t('confirm-delete-notice', {
              asset: lang === 'ar' ? 'موظف' : 'The Employee',
            })}
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => setToggleDelete(false)}
          variant='success'
          size='lg'
        >
          {t('cancel')}
        </Button>
        <Button variant='danger' size='lg' onClick={confirmDeleteUser}>
          {t('delete')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default DeleteEmployee
