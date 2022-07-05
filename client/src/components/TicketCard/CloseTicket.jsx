import React, { useEffect } from 'react'
import style from './style.module.scss'
import { Modal, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import actions from '../../actions'
import { useDispatch, useSelector } from 'react-redux'
import constants from '../../constants'

const CloseTicket = ({ toggleClose, setToggleClose, setIsClosing, id }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { message } = useSelector((state) => state.updateTicketState)

  const clearAlert = (_) => {
    dispatch({ type: constants.tickets.UPDATE_TICKET_STATE_RESET })
  }
  const confirmClose = (_) => {
    setIsClosing(true)
    setToggleClose(false)
    setTimeout(() => {
      dispatch(actions.tickets.updateTicketStatus(id))
    }, 500)
  }
  useEffect(() => {
    message && setIsClosing(false)
  }, [message])

  useEffect(() => {
    return () => clearAlert()
  }, [])
  return (
    <Modal show={toggleClose} onHide={() => setToggleClose(false)}>
      <Modal.Body>
        <div className={style.panel__close}>
          <h2>{t('are-you-sure')}</h2>
          <p>{t('confirm-ticket-close')}</p>
          <p>{t('undone-process')}</p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={confirmClose} variant='danger' size='lg'>
          {t('close-btn')}
        </Button>
        <Button
          variant='success'
          size='lg'
          onClick={() => setToggleClose(false)}
        >
          {t('dont-close')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default CloseTicket
