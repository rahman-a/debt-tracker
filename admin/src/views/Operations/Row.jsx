import React, {useState} from 'react';
import style from './style.module.scss'
import {Badge} from 'react-bootstrap'
import CopyToClipboard from 'react-copy-to-clipboard'
import {Currency, Note} from '../../components'
import {Check, Copy, Reader} from '../../icons'
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

const Row = ({operation, idx}) => {
    const [isCopied, setIsCopied] = useState(false)
    const [isNoteOn, setIsNoteOn] = useState(false)
    const [copyCode, setCopyCode] = useState(null)
    const {t} = useTranslation()
    const lang = i18next.language

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
        
    const getStateColor = state => { 
        const states = {
            pending:'#FBFCD4',
            decline:'#FCD4DB',
            active:'#C7FFCE',
        }
        return states[state]
    }
    
    return (
    <>
        
        <Note
        isNoteOn={isNoteOn}
        setIsNoteOn={setIsNoteOn}
        note={operation.note}
        />
        
        <tr>
        
            <td> {idx + 1} </td>
            
            <td className={style.operations__id}>
                <CopyToClipboard text={operation._id} onCopy={copyIdHandler}>
                    <span>
                    {isCopied ? <Check/> :<Copy/>} 
                    </span>
                </CopyToClipboard>
                {operation._id.substring(0,12) + '...' }
            </td>
            
            <td style={{padding:'0'}}>
                <div className={style.operations__party}>
                <span className={style.operations__label}
                style={{
                    backgroundColor:operation.initiator.type === 'debt'
                    ?'#198754'
                    :'#1a374d'
                }}>
                    {t(operation.initiator.type)} 
                </span>
                    <span> 
                        {
                            lang === 'ar' 
                            ? operation.initiator.user.fullNameInArabic
                            : operation.initiator.user.fullNameInEnglish
                        } 
                    </span>  
                    <span> 
                       <Badge bg='dark'> 
                            {operation.initiator.user.code} 
                       </Badge>   
                        <CopyToClipboard text={operation.initiator.user.code} 
                        onCopy={() => copyCodeHandler(operation.initiator.user.code)}>
                            <span className={`${style.operations__code} ${lang === 'ar' ? style.operations__code_ar :''}`}>
                                {
                                    copyCode === operation.initiator.user.code
                                    ? <Check/> 
                                    :<Copy/>
                                } 
                            </span>
                        </CopyToClipboard>
                    </span>       
                </div>
            </td>

            <td style={{padding:'0'}} className={style.operations__party}>
                <div className={style.operations__party}>
                    <span className={style.operations__label}
                    style={{
                        backgroundColor:operation.peer.type === 'debt'
                        ?'#198754'
                        :'#1a374d'
                    }}>
                        {t(operation.peer.type)}
                    </span>
                    <span> 
                        {
                            lang === 'ar' 
                            ? operation.peer.user.fullNameInArabic
                            : operation.peer.user.fullNameInEnglish
                        }
                    </span>  
                    <span>    
                       <Badge bg='dark'> 
                            {operation.peer.user.code} 
                        </Badge>   
                        <CopyToClipboard text={operation.peer.user.code} onCopy={() => copyCodeHandler(operation.peer.user.code)}>
                            <span className={`${style.operations__code} ${lang === 'ar' ? style.operations__code_ar :''}`}>
                            {
                                copyCode === operation.peer.user.code 
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
                    operation.initiator.value 
                    ? operation.initiator.value 
                    : operation.peer.value
                }
            </td>
            
            {/* Operation Description */}
            <td style={{padding:operation.note ? '0' :'2.5rem 0'}}>
                {operation.note
                ? <p className={style.operations__note}> 
                    <span onClick={() => setIsNoteOn(true)}><Reader/></span> 
                    <i style={{lineBreak:'anywhere', padding:'0 0.8rem'}}>
                        {
                            operation.note?.substring(0, 35) + '...' 
                        }
                    </i> 
                  </p>  
                : 'N/A'}
            </td>
            
            <td>
                <Currency currency={operation.currency}/>
            </td>

            <td style={{
                backgroundColor:getStateColor(operation.state),
                textTransform:'uppercase'
                }}>
                {t(operation.state)}
            </td>
            
            <td> 
                {
                    operation.dueDate 
                    ? new Date(operation.dueDate).toLocaleDateString('en-US', dateFormat)
                    : <Badge bg='success'> N/A </Badge>
                }
                
            </td>
            
            <td> {new Date(operation.createdAt).toLocaleDateString('en-US', dateFormat)} </td>
  
            {/* <td style={{padding:0}}>
                <div className={style.operations__actions}>
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