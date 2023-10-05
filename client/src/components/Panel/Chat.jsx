// @ts-nocheck
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { Chat as ChatIcon } from '@/src/icons'
import { Loader } from '@/src/components'
import constants from '@/src/constants'

const Chat = ({ id }) => {
  const [isChatLoading, setIsChatLoading] = useState(false)
  const { chatClient } = useSelector((state) => state.chatOptions)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const initiateConversationHandler = async () => {
    setIsChatLoading(true)
    const filter = {
      type: 'messaging',
      members: { $eq: [chatClient.user.id.toString(), id.toString()] },
    }
    const sort = { last_message_at: -1 }
    const options = { watch: true, state: true, limit: 1 }
    const channels = await chatClient.queryChannels(filter, sort, options)
    if (channels.length > 0) {
      dispatch({
        type: constants.chat.SET_QUERIED_CHANNEL,
        payload: channels[0],
      })
    } else {
      const newChannel = chatClient.channel('messaging', uuidv4(), {
        members: [chatClient.user.id, id],
      })
      await newChannel.watch({ presence: true })
      dispatch({
        type: constants.chat.SET_QUERIED_CHANNEL,
        payload: newChannel,
      })
    }
    setIsChatLoading(false)
    navigate('/chat')
  }
  return (
    <>
      {isChatLoading ? (
        <Loader
          size='4'
          custom={{ color: '#21597f' }}
          options={{ animation: 'border' }}
        />
      ) : (
        <span onClick={initiateConversationHandler}>
          <ChatIcon />
        </span>
      )}
    </>
  )
}

export default Chat
