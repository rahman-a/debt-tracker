import React, { useState } from 'react'
import style from './style.module.scss'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { Loader } from '../../components'
import constants from '../../constants'
import { Chat as ChatIcon } from '../../icons'

const Chat = ({ id }) => {
  const [isChatLoading, setIsChatLoading] = useState(false)
  const { chatClient } = useSelector((state) => state.chatOptions)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const initiateConversationHandler = async () => {
    setIsChatLoading(true)
    const filter = {
      type: 'messaging',
      members: { $eq: [chatClient.user.id.toString(), id.toString()] },
    }
    const sort = { last_message_at: -1 }
    const options = { watch: true, state: true, limit: 1 }
    const channels = await chatClient.queryChannels(filter, sort, options)
    console.log('channel exist: ', channels)
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
    <span className={style.row__chat}>
      {isChatLoading ? (
        <Loader
          size='4'
          center
          custom={{ color: '#fff' }}
          options={{ animation: 'border' }}
        />
      ) : (
        <span onClick={initiateConversationHandler}>
          <ChatIcon />
        </span>
      )}
    </span>
  )
}

export default Chat
