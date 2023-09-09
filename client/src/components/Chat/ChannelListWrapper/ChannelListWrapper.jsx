/* eslint-disable react/prop-types */
import { useChatContext } from '../../../context/ChatContext'
import classnames from 'classnames'
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
