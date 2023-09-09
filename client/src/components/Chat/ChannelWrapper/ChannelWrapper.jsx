/* eslint-disable react/prop-types */
import { useChatContext } from '../../../context/ChatContext'
import classnames from 'classnames'

const ChannelWrapper = ({ children }) => {
  const { isChatOpen } = useChatContext()
  const streamChatChannelWrapperClasses = classnames(
    'str-chat__channel-wrapper',
    {
      'str-chat__close': !isChatOpen,
      'str-chat__open': isChatOpen,
    }
  )
  return <div className={streamChatChannelWrapperClasses}>{children}</div>
}

export default ChannelWrapper
