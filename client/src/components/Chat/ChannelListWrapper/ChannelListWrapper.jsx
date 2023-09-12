/* eslint-disable react/prop-types */
import classnames from 'classnames'
import { useChatContext } from '@/src/context/ChatContext'
const ChannelListWrapper = ({ children }) => {
  const { isChatOpen } = useChatContext()
  const streamChatChannelWrapperClasses = classnames(
    'str-chat__channel-list-wrapper',
    {
      'str-chat__close': isChatOpen,
      'str-chat__open': !isChatOpen,
    }
  )
  return <div className={streamChatChannelWrapperClasses}>{children}</div>
}

export default ChannelListWrapper
