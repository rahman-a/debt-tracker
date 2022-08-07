import React from 'react'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import style from './Chat.module.scss'
import { Conversation, ChatSidebar, BackButton } from '../../components'
import constants from '../../constants'

function Chat({ socket }) {
  const [unSeenMessage, setUnSeenMessage] = useState(null)
  const { staff } = useSelector((state) => state.login)
  const { conversation } = useSelector((state) => state.listMessages)
  const dispatch = useDispatch()

  const navigate = useNavigate()
  const { id } = useParams()
  const { t } = useTranslation()

  const handleNavigationBack = () => {
    if (id) {
      navigate(-2)
    } else navigate(-1)
  }

  useEffect(() => {
    socket.emit('join-chat', staff._id, (error) => {
      if (error) alert(error)
    })
    return () => {
      socket.emit('left-chat', staff._id, (error) => {
        if (error) alert(error)
      })
      dispatch({ type: constants.chat.LIST_CONVERSATION_MESSAGES_RESET })
    }
  }, [])

  useEffect(() => {
    conversation &&
      conversation.metadata.isRoom &&
      socket.emit(
        'join-room',
        {
          _id: staff._id,
          room: conversation.metadata.conversation,
        },
        (error) => {
          if (error) alert(error)
        }
      )
  }, [conversation, staff._id])

  return (
    <div className={style.chat}>
      <BackButton page={() => handleNavigationBack()} text={t('go-back')} />
      <div className={style.chat__container}>
        <ChatSidebar
          socket={socket}
          unSeenMessage={unSeenMessage}
          setUnSeenMessage={setUnSeenMessage}
        />
        <Conversation socket={socket} setUnSeenMessage={setUnSeenMessage} />
      </div>
    </div>
  )
}

export default Chat
