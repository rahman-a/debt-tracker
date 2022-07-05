import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import actions from '../../actions'
import constants from '../../constants'
import { Chat as ChatIcon } from '../../icons'

const Chat = ({ id }) => {
  const dispatch = useDispatch()
  const { loading, conversation } = useSelector(
    (state) => state.initiateConversation
  )
  const navigate = useNavigate()
  const initiateConversationHandler = (_) => {
    dispatch(actions.chat.initiateConversation(id))
  }

  useEffect(() => {
    if (conversation) {
      navigate(`/chat/${conversation}`)
      setTimeout(() => {
        dispatch({ type: constants.chat.INITIATE_CONVERSATION_RESET })
      }, 250)
    }
  }, [conversation])
  return (
    <>
      <span onClick={initiateConversationHandler}>
        <ChatIcon />
      </span>
    </>
  )
}

export default Chat
