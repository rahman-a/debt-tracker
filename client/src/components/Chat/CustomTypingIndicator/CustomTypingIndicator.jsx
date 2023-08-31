import React from 'react'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'
import classnames from 'classnames'
import {
  useChannelStateContext,
  useChatContext,
  useTypingContext,
} from 'stream-chat-react'

const CustomTypingIndicator = (props) => {
  const lang = i18next.language
  const { t } = useTranslation()
  const { channelConfig, thread } = useChannelStateContext()
  const { client } = useChatContext()
  const { typing = {} } = useTypingContext()

  if (channelConfig?.typing_events === false) {
    return null
  }

  const typingInChannel = Object.values(typing).filter(
    ({ parent_id, user }) => user?.id !== client.user?.id && !parent_id
  )

  const typingClassnames = classnames('str-chat__typing-indicator', {
    'str-chat__typing-indicator--typing': typingInChannel.length,
  })

  return (
    <div className={typingClassnames}>
      <div className='str-chat__typing-indicator__avatars'>
        {typingInChannel.map(({ user }, i) => (
          <div className='username'>
            <div className='typing-indicator-name'>
              {t('typing-user', {
                name: lang === 'ar' ? user?.arabicName : user?.name,
              })}
            </div>
          </div>
        ))}
      </div>
      {typingInChannel.length > 0 && (
        <div className='str-chat__typing-indicator__dots'>
          <div className='str-chat__typing-indicator__dot' />
          <div className='str-chat__typing-indicator__dot' />
          <div className='str-chat__typing-indicator__dot' />
        </div>
      )}
    </div>
  )
}

export default CustomTypingIndicator
