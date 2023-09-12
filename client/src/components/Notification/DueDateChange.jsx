import React, { useState, useEffect } from 'react'
import style from './style.module.scss'
import { Modal, Button, Alert, Table } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import actions from '@/src/actions'
import { Loader } from '@/src/components'
import { Calendar } from '@/src/icons'

const ChangeDue = ({
  isDueChange,
  setIsDueChange,
  date,
  englishName,
  arabicName,
  report,
  id,
}) => {
  const [changeState, setChangeState] = useState(false)
  const { loading, error, message } = useSelector(
    (state) => state.approveDueDate
  )
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const lang = i18next.language

  const changeDueDateHandler = (_) => {
    setChangeState(true)
    dispatch(actions.reports.approveDueDate(report, { date }))
  }
  useEffect(() => {
    message &&
      changeState &&
      dispatch(actions.notifications.updateNotificationState(id))
  }, [message])

  return (
    <Modal show={isDueChange} onHide={() => setIsDueChange(false)}>
      <Modal.Header>
        <p>
          <span>
            {' '}
            <Calendar />{' '}
          </span>
          <span>{t('due-date-change')}</span>
        </p>
      </Modal.Header>
      <Modal.Body>
        <div style={{ textAlign: 'center', position: 'relative' }}>
          {message && <Alert variant='success'> {message} </Alert>}
          {error && <Alert variant='danger'>{error}</Alert>}
          {loading && (
            <Loader
              size='8'
              center
              options={{ animation: 'border' }}
              custom={{ zIndex: '999' }}
            />
          )}

          <h2 style={{ fontSize: '1.6rem', padding: '2rem 0' }}>
            {t('approve-due-date-change')}
          </h2>
          <Table>
            <tbody>
              <tr>
                <td>{t('request-to-change')}</td>
                <td>{lang === 'ar' ? arabicName : englishName}</td>
              </tr>
              <tr>
                <td>{t('due-date-report')}</td>
                <td>
                  <span className={style.notification__dueDate}>
                    {' '}
                    {report}{' '}
                  </span>
                </td>
              </tr>
              <tr>
                <td>{t('new-due-date')}</td>
                <td>
                  {new Date(date).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>
              </tr>
            </tbody>
          </Table>
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

export default ChangeDue
