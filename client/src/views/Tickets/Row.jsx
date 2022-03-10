import React, {useState, useEffect} from 'react'
import style from './style.module.scss'
import {Badge, Modal, Button} from 'react-bootstrap'
import {useNavigate} from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import CopyToClipboard from 'react-copy-to-clipboard'
import parser from 'html-react-parser'
import {useTranslation} from 'react-i18next'
import {Loader} from '../../components'
import {Lock, Check, Copy} from '../../icons'
import actions from '../../actions'
import constants from '../../constants'
import msToTime from '../../config/msToTime'
import i18next from 'i18next'

const Row = ({ticket,idx}) => {
    const [toggleClose, setToggleClose] = useState(false)
    const [isClosing, setIsClosing] = useState(false)
    const [isCopied, setIsCopied] = useState(false)
    const {message} = useSelector(state => state.updateTicketState)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {t} = useTranslation()
    const lang = i18next.language 
    const dateFormat = {
        day:'2-digit',
        month:'short',
        year:'numeric'
    }

    const confirmClose = _ => {
        setIsClosing(true)
        setToggleClose(false)
        setTimeout(() => {
            dispatch(actions.tickets.updateTicketStatus(ticket._id))
        },500)
    }

    const clearAlert = _ => {
        dispatch({type:constants.tickets.UPDATE_TICKET_STATE_RESET})
    }

    
    const initiateCloseTicket  = _ => {
        if(ticket.isOpen) {
            setToggleClose(true)
        }
    }

    const copyIdHandler = _ => {
        setIsCopied(true)
        setTimeout(() => {
            setIsCopied(false)
        },500)
    }

    const parseHTMLBody = _ => {
       const text = parser(ticket.body.substring(0,75) + '....')
       return text
    }
    
    useEffect(() => {
    message && setIsClosing(false)
    },[message])

    useEffect(() => {
        return () => clearAlert()
    },[])

return (

    <>
    
        <Modal show={toggleClose} onHide={() => setToggleClose(false)}>
            <Modal.Body>
                <div className={style.tickets__close}>
                <h2>{t('are-you-sure')}</h2>
                <p>{t('confirm-ticket-close')}</p>
                <p>{t('undone-process')}</p>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button 
                    onClick={() => setToggleClose(false)} 
                    variant='danger' 
                    size='lg'>
                    {t('close-btn')}
                </Button>
                <Button 
                    variant='success' 
                    size='lg'
                    onClick={confirmClose}>
                    {t('dont-close')}
                </Button>
            </Modal.Footer>
        </Modal>
        <tr>
                <td>{idx + 1}</td>
                <td className={style.tickets__code}>
                    <CopyToClipboard text={ticket.code} onCopy={copyIdHandler}>
                        <i>
                            {isCopied ? <Check/> :<Copy/>} 
                        </i>
                    </CopyToClipboard>
                    <Badge bg='dark'> {ticket.code} </Badge>  
                </td>
                
                <td className={style.tickets__summary}>
                    <h3 onClick={() => navigate(`/tickets/${ticket._id}`)}> 
                        {ticket.title} 
                    </h3>
                    <p> {parseHTMLBody()} </p>
                </td> 
                
                <td className={style.tickets__status}>
                    {
                        ticket.isOpen 
                        ? <Badge bg='danger'>{t('open')}</Badge>
                        : <Badge bg='success'>{t('closed')}</Badge>
                    } 
                </td>
                <td>
                    {
                        new Date(ticket.createdAt).toLocaleDateString('en-US', dateFormat)
                    }
                </td>
                <td>
                    {
                        msToTime(new Date().getTime() - new Date(ticket.updatedAt).getTime(), lang)
                    }
                </td>
                <td style={{padding:0}}>
                <div className={style.tickets__action}>
                {
                    isClosing 
                    ? <Loader size='4' options={{animation:'border'}}/>
                    : <span onClick={initiateCloseTicket}> <Lock/> </span>
                }
                </div>
            </td>
        </tr>
    </>
  )
}

export default Row