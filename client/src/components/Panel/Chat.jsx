import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import actions from '../../actions'
import constants from '../../constants'
import { Chat as ChatIcon } from '../../icons'

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
