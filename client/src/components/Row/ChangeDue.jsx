import React, {useState} from 'react'
import style from './style.module.scss'
import {Modal, Button, Alert} from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import actions from '../../actions'
import {DateInput, Loader} from '../../components'
import { Calendar } from '../../icons'
import { useTranslation } from 'react-i18next'

const ChangeDue = ({isDueChange, setIsDueChange, id, op}) => {
  const [dueDateChange, setDueDateChange] = useState(null)
  const {loading, error, message} = useSelector(state => state.updateDueDate)
  const dispatch = useDispatch()
  const {t} = useTranslation()

  const changeDueDateHandler = _ => {
      if(!op && dueDateChange) {
          
          
          dispatch(actions.reports.changeDueDate(id, {date:dueDateChange}))
      }
  }
return (
    <Modal show={isDueChange} onHide={() => setIsDueChange(false)}>
            <Modal.Header>
                <p>
                    <span> <Calendar/> </span>
                    <span> {t('change-due-date')} </span>
                </p>
            </Modal.Header>
            <Modal.Body>
                <div style={{textAlign:'center', position:'relative'}}>
                    
                    { message && <Alert variant='success'> {message} </Alert> }
                    { error   && <Alert variant='danger'>{error}</Alert> }
                    { loading && <Loader size='8' center options={{animation:'border'}} custom={{zIndex:'999'}}/> }
                    
                    <h2>{t('choose-new-due-date')}</h2>
                    <DateInput 
                        name='dueDate' 
                        getExpiryDate={(date) => setDueDateChange(date)}
                        custom={{marginLeft:'0', transform:'unset'}}
                        disabled={loading ? true : false}/>
                </div>

            </Modal.Body>
            <Modal.Footer>
                    
                    <Button 
                    size='lg' 
                    variant='success' 
                    onClick={changeDueDateHandler}
                    disabled={loading ? true : false}> 
                        {t('confirm-change')}
                    </Button>
                    
                    <Button 
                    size='lg' 
                    variant='danger' 
                    onClick={() => setIsDueChange(false)}
                    disabled={loading ? true : false}>
                        {t('cancel-change')}
                    </Button>
            </Modal.Footer>
        </Modal>
  )
}

export default ChangeDue