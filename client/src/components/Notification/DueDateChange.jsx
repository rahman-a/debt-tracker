import React, {useState} from 'react'
import style from './style.module.scss'
import {Modal, Button, Alert, Table} from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import actions from '../../actions'
import {Loader} from '../../components'
import { Calendar } from '../../icons'

const ChangeDue = ({isDueChange, setIsDueChange,date, name, report}) => {
  const {loading, error, message} = useSelector(state => state.approveDueDate)
  const dispatch = useDispatch()
  
  const changeDueDateHandler = _ => {
        dispatch(actions.reports.approveDueDate(report, {date}))
  }
return (
    <Modal show={isDueChange} onHide={() => setIsDueChange(false)}>
            <Modal.Header>
                <p>
                    <span> <Calendar/> </span>
                    <span> Due Date Change</span>
                </p>
            </Modal.Header>
            <Modal.Body>
                <div style={{textAlign:'center', position:'relative'}}>
                    
                    { message && <Alert variant='success'> {message} </Alert> }
                    { error   && <Alert variant='danger'>{error}</Alert> }
                    { loading && <Loader size='8' center options={{animation:'border'}} custom={{zIndex:'999'}}/> }
                    
                    <h2 style={{fontSize:'1.6rem', padding:'2rem 0'}}>Approve Due Date Change</h2>
                    <Table>
                        <tbody>
                            <tr>
                                <td>Request to Change</td>
                                <td>{name}</td>
                            </tr>
                            <tr>
                                <td>Report</td>
                                <td>
                                 <span className={style.notification__dueDate}> {report} </span>   
                                </td>
                            </tr>
                            <tr>
                                <td>New Due Date</td>
                                <td>{new Date(date).toLocaleDateString('en-US', {day:'numeric', month:'short', year:'numeric'})}</td>
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
                    disabled={loading ? true : false}> 
                        YES,Change Due Date 
                    </Button>
                    
                    <Button 
                    size='lg' 
                    variant='danger' 
                    onClick={() => setIsDueChange(false)}
                    disabled={loading ? true : false}>
                        NO, Close
                    </Button>
            </Modal.Footer>
        </Modal>
  )
}

export default ChangeDue