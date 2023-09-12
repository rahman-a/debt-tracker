import React, { useEffect } from 'react'
import style from './style.module.scss'
import { Modal, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { useDispatch, useSelector } from 'react-redux'
import SideAlert from '../SideAlert/SideAlert'
import actions from '@/src/actions'

const Delete = ({ toggleDelete, setToggleDelete, setIsDeleting, id }) => {
  const dispatch = useDispatch()
  const { message, error } = useSelector((state) => state.deleteEmployee)
  const { t } = useTranslation()
  const lang = i18next.language

  const confirmDeleteUser = () => {
    setToggleDelete(false)
    setIsDeleting(true)
    setTimeout(() => {
      dispatch(actions.employees.deleteEmployee(id))
    }, 500)
  }

  useEffect(() => {
    ;(message || error) && setIsDeleting(false)
  }, [message, error])

  return (
    <>
      <SideAlert type='danger' text={error} isOn={error} position='right' />
      <SideAlert
        type='success'
        text={message}
        isOn={message}
        position='right'
      />
      <Modal show={toggleDelete} onHide={() => setToggleDelete(false)}>
        <Modal.Body>
          <div className={style.panel__delete}>
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
    </>
  )
}

export default Delete
