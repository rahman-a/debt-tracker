/* eslint-disable react/prop-types */
import { useEffect } from 'react'
import style from './style.module.scss'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import i18next from 'i18next'
import Dayjs from 'dayjs'
import 'dayjs/locale/ar'
import {
  Chat as StreamChatComponent,
  ChannelList,
  Channel,
  Window,
  MessageList,
  MessageInput,
  LoadingIndicator,
  Streami18n,
} from 'stream-chat-react'
import {
  ChannelListWrapper,
  ChannelWrapper,
  ChatHeader,
  ChatInput,
  ChatSidebar,
  CustomAttachment,
  CustomTypingIndicator,
} from '@/src/components/Chat'
import { BackButton } from '@/src/components'
import ChatContextProvider from '@/src/context/ChatContext'
import constants from '@/src/constants'
import { getUnreadMessages } from '@/src/utils/chat'
import arabicTranslation from '@/src/localization/chat/ar.json'

const Chat = ({ chatClient, user }) => {
  const lang = i18next.language
  const i18Instance = new Streami18n({
    language: lang,
    DateTimeParser: Dayjs,
    translationsForLanguage: lang === 'ar' ? arabicTranslation : null,
  })
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const unreadMessage = async () => {
    dispatch({
      type: constants.chat.GET_UNREAD_COUNT,
      payload: await getUnreadMessages(chatClient, user._id),
    })
  }
  useEffect(() => {
    const timeout = setTimeout(() => {
      unreadMessage()
      clearTimeout(timeout)
    }, 1000)
  }, [])
  return (
    <ChatContextProvider>
      <div className={style.chat}>
        {chatClient ? (
          <>
            <BackButton page={() => navigate(-1)} text='Back' />
            <div className={style.chat__container}>
              <StreamChatComponent
                client={chatClient}
                i18nInstance={i18Instance}
              >
                <ChannelListWrapper>
                  <ChannelList
                    List={ChatSidebar}
                    sendChannelsToList
                    filters={{ members: { $in: [user._id] } }}
                    sort={{ last_message_at: -1 }}
                  />
                </ChannelListWrapper>
                <ChannelWrapper>
                  <Channel
                    TypingIndicator={CustomTypingIndicator}
                    Input={ChatInput}
                    Attachment={CustomAttachment}
                  >
                    <Window>
                      <ChatHeader />
                      <MessageList
                        disableQuotedMessages={true}
                        messageActions={['edit', 'delete', 'react']}
                      />
                      <MessageInput />
                    </Window>
                  </Channel>
                </ChannelWrapper>
              </StreamChatComponent>
            </div>
          </>
        ) : (
          <div className={style.chat__loading}>
            <LoadingIndicator />
          </div>
        )}
      </div>
    </ChatContextProvider>
  )
}

export default Chat
