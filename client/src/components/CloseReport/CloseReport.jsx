import React from 'react'
import style from './style.module.scss'
import { Modal, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import i18next from 'i18next'
import { Loader, SideAlert } from '../../components'
import constants from '../../constants'
import actions from '../../actions'

const CloseReport = ({ isReportClose, setIsReportClose, report }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const lang = i18next.language
  const { loading, error, message, fineNotPaid } = useSelector(
    (state) => state.closeReport
  )

  const confirmClose = (_) => {
    dispatch(actions.reports.closeReport(report))
  }

  const clearAlert = (_) => {
    dispatch({ type: constants.reports.CLOSE_REPORT_RESET })
  }

  return (
    <>
      <SideAlert
        type='danger'
        text={error}
        isOn={error ? true : false}
        reset={() => clearAlert()}
      />
      <SideAlert
        type='success'
        text={message}
        isOn={message ? true : false}
        reset={() => clearAlert()}
      />
      <Modal show={isReportClose} onHide={() => setIsReportClose(false)}>
        {loading && (
          <Loader size='5' center options={{ animation: 'border' }} />
        )}
        <Modal.Body>
          {fineNotPaid ? (
            <div className={style.close__fine}>
              <h2>{t('transaction_paid')}</h2>
              <p>
                <strong>{t('be_informed')}</strong> {t('delayed_fine_not_paid')}
              </p>
              <ul>
                <li>{t('transaction_still_open')}</li>
                <li>
                  {t('badge_still_red', {
                    member: lang === 'en' ? 'Debtor' : 'العضو المدين',
                  })}
                </li>
              </ul>
            </div>
          ) : (
            <div className={style.close}>
              <h2>{t('are-you-sure')}</h2>
              <p>{t('confirm-report-close')}</p>
              <p>{t('undone-report-process')}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {!fineNotPaid && (
            <Button
              onClick={confirmClose}
              variant='success'
              size='lg'
              disabled={loading ? true : false}
            >
              {t('close-report')}
            </Button>
          )}
          <Button
            variant='danger'
            size='lg'
            onClick={() => setIsReportClose(false)}
            disabled={loading ? true : false}
          >
            {fineNotPaid ? t('close') : t('not-close-report')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default CloseReport
