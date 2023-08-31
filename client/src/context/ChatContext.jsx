/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'

const ChatContext = createContext()

export const useChatContext = () => useContext(ChatContext)

const ChatBlockProvider = ({ children }) => {
  const [trackRunningAudio, setTrackRunningAudio] = useState()
  const [isChatOpen, setIsChatOpen] = useState(false)

  const data = {
    trackRunningAudio,
    setTrackRunningAudio,
    isChatOpen,
    setIsChatOpen,
  }

  return <ChatContext.Provider value={data}>{children}</ChatContext.Provider>
}

export default ChatBlockProvider
