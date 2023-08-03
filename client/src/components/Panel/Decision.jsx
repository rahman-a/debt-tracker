import React from 'react'
import style from './style.module.scss'
import { Modal, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import actions from '../../actions'
import constants from '../../constants'
import { SideAlert, Loader } from '../../components'
import { useTranslation } from 'react-i18next'

const Decision = ({ isDecision, setIsDecision, id }) => {
  const { loading, error, message } = useSelector(
    (state) => state.updateOperationState
  )
  const dispatch = useDispatch()

  const { t } = useTranslation()

  const declineOperationHandler = (_) => {
    dispatch(actions.operations.updateOperationState(id, undefined, 'decline'))
  }

  const approveOperationHandler = (_) => {
    dispatch(actions.operations.updateOperationState(id, undefined, 'active'))
  }

  const clearAlert = (_) => {
    dispatch({ type: constants.operations.UPDATE_OPERATION_STATE_RESET })
  }

  return (
    <>
      <SideAlert
        type='success'
        isOn={message ? true : false}
        text={message}
        reset={() => clearAlert()}
      />

      <SideAlert
        type='danger'
        isOn={error ? true : false}
        text={error}
        reset={() => clearAlert()}
      />
      <Modal show={isDecision} onHide={() => setIsDecision(false)}>
        <Modal.Body>
          {loading && (
            <div className='loading__overflow'>
              <Loader
                size='4'
                center
                options={{ animation: 'border' }}
                custom={{ color: '#fff' }}
              />
            </div>
          )}
          <div className={style.panel__decision}>
            <Button
              variant='success'
              size='lg'
              onClick={approveOperationHandler}
            >
              {t('decision-approve')}
            </Button>
            <Button
              variant='danger'
              size='lg'
              onClick={declineOperationHandler}
            >
              {t('decision-decline')}
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='secondary'
            disabled={loading ? true : false}
            size='lg'
            onClick={() => setIsDecision(false)}
          >
            {t('close')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Decision
