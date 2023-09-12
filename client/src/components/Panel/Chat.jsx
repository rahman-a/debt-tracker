import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Chat as ChatIcon } from '@/src/icons'

const Chat = ({ id }) => {
  const dispatch = useDispatch()

  const navigate = useNavigate()

  const initiateConversationHandler = () => {}
  return (
    <>
      <span onClick={initiateConversationHandler}>
        <ChatIcon />
      </span>
    </>
  )
}

export default Chat
