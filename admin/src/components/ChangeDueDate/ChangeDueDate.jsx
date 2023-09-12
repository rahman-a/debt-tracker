import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import { Modal, Button, Alert } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { DateInput, Loader } from '..'
import { Calendar } from '@/src/icons'
import actions from '@/src/actions'
import constants from '@/src/constants'

const ChangeDueDate = ({ isDueChange, setIsDueChange, id }) => {
  const [dueDateChange, setDueDateChange] = useState(null)
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { loading, error, message } = useSelector((state) => state.updateReport)

  const changeDueDateHandler = (_) => {
    dispatch(actions.reports.updateReport(id, { dueDate: dueDateChange }))
  }

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        setIsDueChange(false)
        dispatch({ type: constants.reports.UPDATE_REPORT_RESET })
      }, 500)
    }
  }, [message])

  return (
    <Modal show={isDueChange} onHide={() => setIsDueChange(false)}>
      <Modal.Header>
        <p>
          <span>
            <Calendar />
          </span>
          <span> {t('change-due-date')} </span>
        </p>
      </Modal.Header>
      <Modal.Body>
        <div className={style.dueChange}>
          {message && <Alert variant='success'> {message} </Alert>}
          {error && <Alert variant='danger'>{error}</Alert>}
          {loading && (
            <Loader size='8' center options={{ animation: 'border' }} />
          )}

          <h2>{t('choose-new-due-date')}</h2>
          <DateInput
            name='dueDate'
            getExpiryDate={(date) => setDueDateChange(date)}
            custom={{ marginLeft: '0', transform: 'unset' }}
            disabled={loading ? true : false}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          size='lg'
          variant='success'
          onClick={changeDueDateHandler}
          disabled={loading ? true : false}
        >
          {t('confirm-change')}
        </Button>

        <Button
          size='lg'
          variant='danger'
          onClick={() => setIsDueChange(false)}
          disabled={loading ? true : false}
        >
          {t('cancel-change')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ChangeDueDate
