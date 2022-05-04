import React, {useState} from 'react';
import style from './style.module.scss'
import {Badge} from 'react-bootstrap'
import CopyToClipboard from 'react-copy-to-clipboard'
import { Currency, Note} from '../../components'
import {Check, Copy, Reader} from '../../icons'


const Row = ({report, idx, due}) => {
    const [isCopied, setIsCopied] = useState(false)
    const [isNoteOn, setIsNoteOn] = useState(false)
    const [copyCode, setCopyCode] = useState(null)

    
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
    
  
    return (
    <>
        
        <Note
        isNoteOn={isNoteOn}
        setIsNoteOn={setIsNoteOn}
        note={report.operation.note}
        />
        
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

 
            <td> 
                {
                    report.paymentDate 
                    ? new Date(report.dueDate).toLocaleDateString('en-US', dateFormat)
                    : <Badge bg='success'> N/A </Badge>
                }
                
            </td>
            
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