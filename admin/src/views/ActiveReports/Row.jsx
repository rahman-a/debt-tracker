import React, {useState, useEffect} from 'react';
import style from './style.module.scss'
import {Badge, Button, Modal, Alert} from 'react-bootstrap'
import CopyToClipboard from 'react-copy-to-clipboard'
import {useSelector, useDispatch} from 'react-redux'
import { Currency, Note, DateInput, Loader} from '../../components'
import {Check, Copy, Reader, Calendar} from '../../icons'
import actions from '../../actions'
import constants from '../../constants'

const Row = ({report, idx, due}) => {
    const [isDueChange, setIsDueChange] = useState(false)
    const [dueDateChange, setDueDateChange] = useState(null)
    const [isCopied, setIsCopied] = useState(false)
    const [isNoteOn, setIsNoteOn] = useState(false)
    const [copyCode, setCopyCode] = useState(null)
    const dispatch = useDispatch() 
    const {loading, error, message} = useSelector(state => state.updateReport)
    
    const dateFormat = {
        day:'2-digit',
        month:'short',
        year:'numeric'
    }
    
    const copyIdHandler = _ => {
        setIsCopied(true)
        setTimeout(() => {
            setIsCopied(false)
        },500)
    }

    const copyCodeHandler = code => {
        setCopyCode(code)
        setTimeout(() => {
            setCopyCode(null)
        },500)
    }

    const changeDueDateHandler = _ => {
        dispatch(actions.reports.updateReport(report._id, {dueDate:dueDateChange}))
    }

    useEffect(() => {
        if(message) {
            setTimeout(() => {
                setIsDueChange(false)
                dispatch({type: constants.reports.UPDATE_REPORT_RESET})
            }, 3000);
        } 
    }, [message])
    
    
  
    return (
    <>
        
        <Note
        isNoteOn={isNoteOn}
        setIsNoteOn={setIsNoteOn}
        note={report.operation.note}
        />
        
        <Modal show={isDueChange} onHide={() => setIsDueChange(false)}>
            <Modal.Header>
                <p>
                    <span> <Calendar/> </span>
                    <span> Change Due Date </span>
                </p>
            </Modal.Header>
            <Modal.Body>
                <div className={style.reports__dueChange}>
                    
                    { message && <Alert variant='success'> {message} </Alert> }
                    { error   && <Alert variant='danger'>{error}</Alert> }
                    { loading && <Loader size='8' center options={{animation:'border'}}/> }
                    
                    <h2>Choose the New Due Date</h2>
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
        
        
        
        
        <tr>
        
            <td> {idx + 1} </td>
            
            <td className={style.reports__id}>
                <CopyToClipboard text={report._id} onCopy={copyIdHandler}>
                    <span>
                    {isCopied ? <Check/> :<Copy/>} 
                    </span>
                </CopyToClipboard>
                {report._id.substring(0,12) + '...' }
            </td>
            
            <td style={{padding:'0'}}>
                <div className={style.reports__party}>
                <span className={style.reports__label}
                style={{
                    backgroundColor:report.operation.initiator.type === 'debt'
                    ?'#198754'
                    :'#1a374d'
                }}>
                    {report.operation.initiator.type} 
                </span>
                    <span> 
                        {
                        report.operation.initiator.fullNameInEnglish ||
                        report.operation.initiator.user?.fullNameInEnglish
                        } 
                    </span>  
                    <span> 
                       <Badge bg='dark'> 
                            {
                            report.operation.initiator.code ||
                            report.operation.initiator.user?.code 
                            } 
                       </Badge>   
                        <CopyToClipboard text={
                            report.operation.initiator.code ||
                            report.operation.initiator.user?.code
                        } 
                        onCopy={() => copyCodeHandler(
                            report.operation.initiator.code ||
                            report.operation.initiator.user?.code
                        )}>
                            <span className={style.reports__code}>
                                {
                                    copyCode === 
                                    (report.operation.initiator.code ||
                                    report.operation.initiator.user?.code)
                                    ? <Check/> 
                                    :<Copy/>
                                } 
                            </span>
                        </CopyToClipboard>
                    </span>       
                </div>
            </td>

            <td style={{padding:'0'}} className={style.reports__party}>
                <div className={style.reports__party}>
                    <span className={style.reports__label}
                    style={{
                        backgroundColor:report.operation.peer.type === 'debt'
                        ?'#198754'
                        :'#1a374d'
                    }}>
                        {report.operation.peer.type}
                    </span>
                    <span> 
                        {
                        report.operation.peer.fullNameInEnglish || 
                        report.operation.peer.user?.fullNameInEnglish 
                        }
                    </span>  
                    <span>    
                       <Badge bg='dark'> 
                            {
                                report.operation.peer.code || 
                                report.operation.peer.user?.code 
                            } 
                        </Badge>   
                        <CopyToClipboard text={
                            report.operation.peer.code ||
                            report.operation.peer.user?.code
                        } 
                        onCopy={() => copyCodeHandler(
                            report.operation.peer.code ||
                            report.operation.peer.user?.code
                        )}>
                            <span className={style.reports__code}>
                            {
                                copyCode === 
                                (report.operation.peer.code ||
                                report.operation.peer.user?.code)
                                ? <Check/> 
                                :<Copy/>
                            } 
                            </span>
                        </CopyToClipboard>
                    </span> 
                </div>
            </td>
            
            <td>
                {
                    report.credit 
                    ? report.credit 
                    : report.debt
                }
            </td>
            
            {/* Operation Description */}
            <td style={{padding:report.operation.note ? '0' :'2.5rem 0'}}>
                {report.operation.note
                ? <p className={style.reports__note}> 
                    <span onClick={() => setIsNoteOn(true)}><Reader/></span> 
                    <i style={{lineBreak:'anywhere', padding:'0 0.8rem'}}>
                        {
                            report.operation.note?.substring(0, 35) + '...' 
                        }
                    </i> 
                  </p>  
                : 'N/A'}
            </td>
            
            <td>
                <Currency currency={report.currency}/>
            </td>

           {
               due && 
                    <td> 
                        {
                            report.dueDate 
                            ? <span className={style.reports__dueDate}
                              onClick={() => setIsDueChange(true)}> 
                                { new Date(report.dueDate).toLocaleDateString('en-US', dateFormat) } 
                            </span>
                            : <Badge bg='success'> N/A </Badge>
                        }
                        
                    </td>
           } 
            
            <td> {new Date(report.createdAt).toLocaleDateString('en-US', dateFormat)} </td>
  
            {/* <td style={{padding:0}}>
                <div className={style.reports__actions}>
                <span onClick={() => navigate(`/member/${operation._id}`)}> <Edit/> </span>
                {
                    isDeleting 
                    ? <Loader size='4' options={{animation:'border'}}/>
                    : <span onClick={() => initiateOperationDelete(operation._id)}> <Trash/> </span>
                }
                </div>
            </td> */}
        </tr>
    </>
  )
}

export default Row