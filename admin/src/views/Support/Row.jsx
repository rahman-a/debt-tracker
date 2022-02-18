import React, {useState, useEffect} from 'react'
import style from './style.module.scss'
import {Badge, Modal, Button} from 'react-bootstrap'
import {useNavigate} from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import CopyToClipboard from 'react-copy-to-clipboard'
import {Loader, SideAlert} from '../../components'
import {Lock, Check, Copy} from '../../icons'
import actions from '../../actions'
import constants from '../../constants'
import msToTime from '../../config/msToTime'

const Row = ({ticket,idx}) => {
    const [toggleClose, setToggleClose] = useState(false)
    const [isClosing, setIsClosing] = useState(false)
    const [isCopied, setIsCopied] = useState(false)
    const {error, message} = useSelector(state => state.updateTicketState)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
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
    
    useEffect(() => {
    message && setIsClosing(false)
    },[message])

    useEffect(() => {
        return () => clearAlert()
    },[])

return (

    <>

    <SideAlert
    type='danger'
    text={error}
    isOn={error ? true : false}
    reset={() => clearAlert}
    />

    <SideAlert
    type='success'
    text={message}
    isOn={message ? true : false}
    reset={() => clearAlert}
    />
    
    <Modal show={toggleClose} onHide={() => setToggleClose(false)}>
        <Modal.Body>
            <div className={style.support__close}>
              <h2>Are You Sure?</h2>
              <p>Do you really want to delete the member?</p>
              <p>This Process can't be undone.</p>
            </div>
        </Modal.Body>
        <Modal.Footer>
              <Button 
                onClick={() => setToggleClose(false)} 
                variant='success' 
                size='lg'>
                NO, DON'T CLOSE
              </Button>
              <Button 
                variant='danger' 
                size='lg'
                onClick={confirmClose}>
                YES, CLOSE THE TICKET
              </Button>
        </Modal.Footer>
    </Modal>
    <tr>
            <td>{idx + 1}</td>
            <td className={style.support__code}>
                <CopyToClipboard text={ticket.code} onCopy={copyIdHandler}>
                    <i>
                        {isCopied ? <Check/> :<Copy/>} 
                    </i>
                </CopyToClipboard>
                <Badge bg='dark'> {ticket.code} </Badge>  
            </td>
            <td className={style.support__info}>
                <figure>
                    <img src={`/api/files/${ticket.member.avatar}`} alt="member" />
                </figure>
                <div>
                    <p onClick={() => navigate(`/member/${ticket.member._id}`)}> 
                        {ticket.member.fullNameInEnglish}  
                    </p>
                    <span> {ticket.member.email.email} </span>
                </div>
            </td>
            
            <td className={style.support__summary}>
                <h3 onClick={() => navigate(`/ticket/${ticket._id}`)}> 
                    {ticket.title} 
                </h3>
                <p>
                    {ticket.body.substring(0, 75) + '....'}
                </p>
            </td> 
            
            <td className={style.support__status}>
                {
                    ticket.isOpen 
                    ? <Badge bg='danger'>OPEN</Badge>
                    : <Badge bg='success'>SOLVED</Badge>
                } 
            </td>
            <td>
                {
                    new Date(ticket.createdAt).toLocaleDateString('en-US', dateFormat)
                }
            </td>
            <td>
                {
                    msToTime(new Date().getTime() - new Date(ticket.updatedAt).getTime())
                }
            </td>
            <td style={{padding:0}}>
            <div className={style.support__action}>
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