/* eslint-disable react/prop-types */
import { useCallback, useEffect, useState } from 'react'
import style from './style.module.scss'
import Scrollbar from 'simplebar-react'
import { useSelector, useDispatch } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { useChatContext } from 'stream-chat-react'
import { useTranslation } from 'react-i18next'
import { useChatContext as useChatBlockContext } from '../../../context/ChatContext'
import userImage from '../../../asset/images/user.png'
import Loader from '../../Loader/Loader'
import SearchInput from './searchInput'
import Channel from './Channel'
import NewChat from './NewChat'
import constants from '../../../constants'
import { Magnify, BrokenHeart, ChatPlus } from '../../../icons'
import { useMediaQuery } from '../../../hooks'
import api from '../../../api'

const Sidebar = ({ loadedChannels }) => {
  const { channel: activeChannel, client, setActiveChannel } = useChatContext()
  const { setIsChatOpen, isChatOpen } = useChatBlockContext()
  const [isNewChat, setIsNewChat] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState(null)
  const [channels, setChannels] = useState(loadedChannels)
  const { peerId } = useSelector((state) => state.chatOptions)
  const { queriedChannel } = useSelector((state) => state.chatOptions)
  const dispatch = useDispatch()
  const isMobile = useMediaQuery('(max-width: 767.98px)')
  const { t } = useTranslation()

  let Component = null

  if (searchLoading) {
    Component = (
      <div className={style.sidebar__loading}>
        <Loader size='4' center options={{ animation: 'border' }} />
      </div>
    )
  } else if (searchError) {
    Component = (
      <div className={style.sidebar__fallback}>
        <span>
          <BrokenHeart />
        </span>
        <p>{searchError}</p>
        <p>{t('no-result')}</p>
      </div>
    )
  } else if (channels?.length > 0) {
    Component = channels.map((channel) => (
      <Channel
        key={channel.id}
        channel={channel}
        isActive={channel.id === activeChannel.id}
      />
    ))
  } else {
    Component = (
      <div className={style.sidebar__fallback}>
        <span>
          <Magnify />
        </span>
        <p>{t('no-chats')}</p>
        <p>{t('start-new-chat')}</p>
      </div>
    )
  }

  const searchChats = async (name) => {
    setSearchError(null)
    setSearchLoading(true)
    try {
      const { data } = await api.chat.searchUser(name)
      if (data.users.length > 0) {
        const foundChannels = await Promise.all(
          data.users.map(async (user) => {
            const filters = { type: 'messaging', members: { $in: [user._id] } }
            const [existChannel] = await client.queryChannels(filters)
            return existChannel
          })
        )
        const filteredChannels = foundChannels.filter((channel) => channel)
        filteredChannels && setChannels(filteredChannels)
      }
    } catch (error) {
      error.response && setSearchError(error.response.data.message)
    } finally {
      setSearchLoading(false)
    }
  }

  const userAvatar = () => {
    if (client?.user?.image) {
      return `/api/files/${client.user.image}`
    }
    return userImage
  }

  const activateQueriedChannel = useCallback(() => {
    const timeout = setTimeout(() => {
      setActiveChannel(queriedChannel)
      setIsChatOpen(true)
      dispatch({ type: constants.chat.RESET_QUERIED_CHANNEL })
      clearTimeout(timeout)
    }, 250)
  }, [queriedChannel])

  const createDirectChannel = async () => {
    // first check if the channel already exists
    const filters = { type: 'messaging', members: { $in: [peerId] } }
    const [existChannel] = await client.queryChannels(filters)
    if (existChannel) {
      setActiveChannel(existChannel)
      dispatch({ type: constants.chat.SEARCH_USERS_RESET })
      dispatch({ type: constants.chat.RESET_PEER_ID })
      isMobile && setIsChatOpen(true)
      return
    }
    const newChannel = client.channel('messaging', uuidv4(), {
      members: [client.user.id, peerId],
    })
    await newChannel.watch({ presence: true })
    setActiveChannel(newChannel)
    dispatch({ type: constants.chat.SEARCH_USERS_RESET })
    dispatch({ type: constants.chat.RESET_PEER_ID })
    isMobile && setIsChatOpen(true)
  }

  useEffect(() => {
    setChannels(loadedChannels)
    if (peerId) {
      createDirectChannel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peerId])

  useEffect(() => {
    if (queriedChannel) {
      activateQueriedChannel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queriedChannel])

  useEffect(() => {
    if (loadedChannels?.length > 0) {
      setChannels(loadedChannels)
    }
  }, [loadedChannels?.length])

  return (
    <>
      <NewChat isNewChat={isNewChat} setIsNewChat={setIsNewChat} />
      <div
        className={`${style.sidebar} ${isChatOpen ? style.sidebar__off : ''}`}
      >
        <header>
          <img src={userAvatar()} alt='avatar' />
          <button onClick={() => setIsNewChat(true)}>
            <ChatPlus />
          </button>
        </header>
        <SearchInput
          chats={true}
          placeholder={t('find-chat')}
          onClick={(name) => searchChats(name)}
          reset={() => setChannels(loadedChannels)}
        />
        <div className={style.sidebar__body}>
          <Scrollbar style={{ maxHeight: 'calc(100vh - 25.2rem)' }}>
            {Component}
          </Scrollbar>
        </div>
      </div>
    </>
  )
}

export default Sidebar
