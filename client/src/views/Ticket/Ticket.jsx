import React, {useEffect, useState} from 'react'
import style from './style.module.scss'
import {useParams} from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {HeaderAlert, Loader,BackButton, Replay as ReplayResponse} from '../../components'
import msToTime from '../../config/msToTime'
import actions from '../../actions'
import {Replay} from '../../icons'
import TicketResponse from './TicketResponse'

const Ticket = () => {
  const [isEditor, setIsEditor] = useState(false)
  const dispatch = useDispatch()
  const {loading, error, ticket} = useSelector(state => state.getTicket)
  const {id} = useParams()
  
  
  const initiateReplayProcess = _ => {
      if(ticket.isOpen) {
        setIsEditor(true)
      }
  }
  
  useEffect(() => {
    id && dispatch(actions.tickets.getTicketInformation(id))
  },[id])

return (
  <>
    <div className={style.ticket}>
        <h1> Ticket Handling Panel</h1>
                
        <div className='container'>
          {
            loading 
            ? <Loader size='8' options={{animation:'border'}}/>
            : error 
            ? <HeaderAlert type='danger' size='4' text={error}/> 
            : ticket && 
            <div className={style.ticket__wrapper}>
              <div className={style.ticket__header}>
                  <span>
                    {
                     `last updated ${msToTime(new Date().getTime() - new Date(ticket.updatedAt).getTime())} ago`
                    }
                  </span>
                  <button onClick={initiateReplayProcess} disabled={!ticket.isOpen}>
                    <span> <Replay/> </span>
                    <span> Replay </span> 
                  </button>
              </div>
              <div className={style.ticket__response}>
                  <TicketResponse data={{
                    title:ticket.title,
                    body:ticket.body,
                    file:ticket.file,
                    sender:'member',
                    avatar:ticket.member.avatar,
                    email:ticket.member.email.email,
                  }}/>
                 {
                   ticket.response.length > 0 
                   && ticket.response.map(response => (
                     <TicketResponse
                     key={response._id}
                     data={{
                       ...response,
                       avatar:ticket.member.avatar,
                       email:ticket.member.email.email,
                     }}
                     />
                   ))
                 }
              </div>
              
              {
                isEditor && <ReplayResponse setIsEditor={setIsEditor} id={id} type='response'/>
              }
          </div>
          }
        </div>
    </div>
  </>
  )
}

export default Ticket