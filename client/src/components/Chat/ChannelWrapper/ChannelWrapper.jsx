/* eslint-disable react/prop-types */
import { useChatContext } from '../../../context/ChatContext'
const ChannelWrapper = ({ children }) => {
  const { isChatOpen } = useChatContext()
  return (
    <div
      className={`str-chat__channel-wrapper ${
        isChatOpen ? 'str-chat__open' : 'str-chat__close'
      }`}
    >
      {children}
    </div>
  )
}

export default ChannelWrapper
