/* eslint-disable react/prop-types */
import { useChatContext } from '../../../context/ChatContext'
const ChannelListWrapper = ({ children }) => {
  const { isChatOpen } = useChatContext()
  return (
    <div
      className={`str-chat__channel-list-wrapper ${
        !isChatOpen ? 'str-chat__open' : 'str-chat__close'
      }`}
    >
      {children}
    </div>
  )
}

export default ChannelListWrapper
