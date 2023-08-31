/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from 'react'
import { useChatContext } from 'stream-chat-react'
import { useDispatch } from 'react-redux'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'
import { useChatContext as useBlockChatContext } from '../../../context/ChatContext'
import constants from '../../../constants'
import style from './style.module.scss'
import chatImage from '../../../asset/images/chat.png'
import { useMediaQuery } from '../../../hooks'
import { getUnreadMessages } from '../../../utils/chat'

const Channel = ({ isActive, channel }) => {
  const { client, setActiveChannel } = useChatContext()
  const { setIsChatOpen, isChatOpen } = useBlockChatContext()
  const [user, setUser] = useState(null)
  const [isNewMessage, setIsNewMessage] = useState(false)
  const [comingMessage, setComingMessage] = useState('')
  const [lastMessage, setLastMessage] = useState(null)
  const isMobile = useMediaQuery('(max-width: 767.98px)')
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const lang = i18next.language
  const dateFormat = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }

  channel.on('message.new', ({ message }) => {
    if (isActive) {
      setLastMessage(cutLongText(message.text))
      isMobile && !isChatOpen ? setIsNewMessage(true) : setIsNewMessage(false)
    } else {
      setIsNewMessage(true)
      setComingMessage(message.text)
    }
  })

  const unreadMessage = async () => {
    dispatch({
      type: constants.chat.GET_UNREAD_COUNT,
      payload: await getUnreadMessages(client, user.id),
    })
  }

  const activateChannel = () => {
    setActiveChannel(channel)
    setIsChatOpen(true)
    setIsNewMessage(false)
    dispatch({
      type: constants.chat.RESET_QUERIED_CHANNEL,
    })
    const timeout = setTimeout(() => {
      unreadMessage()
      clearTimeout(timeout)
    }, 1000)
  }

  const cutLongText = (lastMessage) => {
    if (lastMessage?.length > 100) {
      return lastMessage.substring(0, 70) + '....'
    }
    return lastMessage
  }

  const chatTitle = () => {
    let title
    if (user?.name) {
      title = lang === 'en' ? user.name : user.arabicName
    } else if (channel?.data?.name) {
      title = channel.data.name
    } else if (channel?.data?.member_count > 2) {
      title = t('room-chat')
    } else {
      title = channel?.id
    }
    return title
  }

  const chatMemberInfo = useCallback(() => {
    let user
    const members = channel?.state.members
    if (channel?.data.member_count > 2) {
      return {
        name: t('room-chat'),
        image: chatImage,
      }
    }
    if (members) {
      for (const key in members) {
        if (key !== client.user.id) {
          user = members[key].user
        }
      }
      setUser(user)
    }
  }, [channel, client.user.id])

  const getLastMessage = useCallback(() => {
    const messages = channel?.state.messageSets[0].messages
    if (messages?.length === 0) return setLastMessage(null)
    const last_message = messages[messages?.length - 1]
    setLastMessage(cutLongText(last_message?.text))
  }, [channel?.state.messageSets])

  useEffect(() => {
    chatMemberInfo()
    getLastMessage()
  }, [channel, client, chatMemberInfo, getLastMessage])
  return (
    <div
      className={`${style.sidebar__body_chat} ${
        isNewMessage ? style.sidebar__body_chat_unseen : ''
      }`}
      style={{
        backgroundColor: isActive ? '#1a374d1a' : 'unset',
      }}
      onClick={() => activateChannel()}
    >
      <figure>
        {isNewMessage && <span style={{ display: 'inline' }}></span>}
        <img
          src={user?.image ? `/api/files/${user.image}` : chatImage}
          alt='chat'
        />
      </figure>
      <div className={style.sidebar__body_overview}>
        <h3>
          {/* group or member name */}
          <span>{chatTitle()}</span>

          {/* last time conversation updated */}
          {channel?.data?.created_at && (
            <span>
              {new Date(channel.data.created_at).toLocaleDateString(
                'en-US',
                dateFormat
              )}
            </span>
          )}
        </h3>

        {/* last message sent to conversation or group */}
        {lastMessage ? (
          <p>{lastMessage}</p>
        ) : (
          isNewMessage && <p>{comingMessage}</p>
        )}
      </div>
    </div>
  )
}

export default Channel
