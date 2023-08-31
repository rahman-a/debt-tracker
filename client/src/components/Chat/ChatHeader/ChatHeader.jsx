import {
  useChatContext,
  Avatar,
  useChannelStateContext,
} from 'stream-chat-react'
import i18next from 'i18next'
import { useCallback, useState } from 'react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useChatContext as useChatBlockContext } from '../../../context/ChatContext'
import userImage from '../../../asset/images/user.png'
import chatImage from '../../../asset/images/chat.png'
import { ArrowLeft } from '../../../icons'
import style from './style.module.scss'

const ChatHeader = () => {
  const [user, setUser] = useState(null)
  const { client } = useChatContext()
  const { setIsChatOpen } = useChatBlockContext()
  const { channel, watcher_count } = useChannelStateContext()
  const { t } = useTranslation()
  const lang = i18next.language
  const getWatchers = (watcherCount) => {
    let text = ''
    if (watcherCount === 1) {
      text = t('one-user-online')
    } else if (watcherCount > 1) {
      text = t('users-online', { count: watcherCount })
    }
    return text
  }

  const chatTitle = () => {
    let title
    if (channel?.data?.name) {
      title = channel.data.name
    } else if (user?.name) {
      title = lang === 'en' ? user.name : user.arabicName
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

  useEffect(() => {
    chatMemberInfo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatMemberInfo])

  return (
    <header className={style.header}>
      <span onClick={() => setIsChatOpen(false)}>
        <ArrowLeft />
      </span>
      <figure
        style={{
          marginRight: '1rem',
          marginLeft: 'unset',
        }}
      >
        <Avatar image={user?.image ? `/api/files/${user.image}` : userImage} />
      </figure>
      <div>
        <h3>{chatTitle()}</h3>
        <p style={{ color: 'green' }}>{getWatchers(watcher_count)}</p>
      </div>
    </header>
  )
}

export default ChatHeader
