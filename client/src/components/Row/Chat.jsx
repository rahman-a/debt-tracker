import React, {useEffect} from 'react'
import style from './style.module.scss'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {Loader} from '../../components'
import actions from '../../actions'
import constants from '../../constants'
import {Chat as ChatIcon} from '../../icons'

const Chat = ({id}) => {
    const dispatch = useDispatch()
    const {loading, conversation} = useSelector(state => state.initiateConversation)
    const navigate = useNavigate()
    const initiateConversationHandler = _ => {
        dispatch(actions.chat.initiateConversation(id))
    }

    useEffect(() => {
        if(conversation) {
            navigate(`/chat/${conversation}`)
            setTimeout(() => {
                dispatch({type:constants.chat.INITIATE_CONVERSATION_RESET})
            },250)
        } 
    },[conversation])
    return (
    <span className={style.row__chat}>
        {
            loading ? <Loader size='4' center custom={{color:'#fff'}} options={{animation:'border'}}/>
            : <span onClick={initiateConversationHandler}> <ChatIcon/> </span>
        }
    </span>
  )
}

export default Chat