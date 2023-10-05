// @ts-nocheck
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Routes, Route } from 'react-router-dom'
import { StreamChat } from 'stream-chat'
import { ToastContainer } from 'react-toastify'
import constants from './constants'
import { Header, AuthorizationRouter, ChatwootLiveChat } from './components'
import {
  Operation,
  Profile,
  Notifications,
  Messages,
  NewOperation,
  ActiveReports,
  ClosedReports,
  Tickets,
  Ticket,
  Chat,
  Employees,
  NewEmployees,
  NotFound,
} from './views'
import { getUnreadMessages } from './utils/chat'

function App() {
  const { chatClient } = useSelector((state) => state.chatOptions)
  const { isAuth, user } = useSelector((state) => state.isAuth)
  const dispatch = useDispatch()

  // useEffect(() => {
  //   let isInterrupted = false
  //   const client = new StreamChat(import.meta.env.VITE_STREAM_API_KEY)
  //   if (
  //     client.tokenManager.token === user?.chat_token &&
  //     client.userID === user?._id
  //   )
  //     return
  //   const connectPromise = client
  //     .connectUser(
  //       {
  //         id: user._id,
  //         name: user.fullNameInEnglish,
  //         image: user.avatar,
  //       },
  //       user.chat_token
  //     )
  //     .then(async () => {
  //       if (isInterrupted) return
  //       console.log('client connected')
  //       const nonReadMessages = await getUnreadMessages(client, user._id)
  //       dispatch({
  //         type: constants.chat.GET_UNREAD_COUNT,
  //         payload: nonReadMessages,
  //       })
  //       dispatch({
  //         type: constants.chat.SET_CHAT_CLIENT,
  //         payload: client,
  //       })
  //     })
  //   return () => {
  //     isInterrupted = true
  //     connectPromise.then(() => {
  //       client.disconnectUser()
  //       dispatch({
  //         type: constants.chat.RESET_CHAT_CLIENT,
  //       })
  //       console.log('client  disconnect')
  //     })
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [user?._id, user?.chat_token])

  return (
    <div className='App' data-theme='dark'>
      {isAuth && <Header />}
      <ToastContainer
        autoClose={false}
        position='bottom-right'
        hideProgressBar={true}
        closeButton={false}
        newestOnTop={true}
        style={{
          maxWidth: '45rem',
          width: 'auto',
          maxHeight: 'calc(100vh - 8rem)',
          overflowX: 'hidden',
          overflowY: 'auto',
        }}
      />
      <Routes>
        <Route path='/' element={<AuthorizationRouter />}>
          <Route index element={<Operation />} />
          <Route path='/operation'>
            <Route index element={<Operation />} />
            <Route path=':id' element={<Operation />} />
            <Route path='new' element={<NewOperation />} />
          </Route>
          <Route path='/employees'>
            <Route
              index
              element={user?.company?.isManager ? <Employees /> : <NotFound />}
            />
            <Route
              path='new'
              element={
                user?.company?.isManager ? <NewEmployees /> : <NotFound />
              }
            />
          </Route>
          <Route path='/reports'>
            <Route path='active' element={<ActiveReports />}>
              <Route path=':id' element={<ActiveReports />} />
            </Route>
            <Route path='closed' element={<ClosedReports />}>
              <Route path=':id' element={<ClosedReports />} />
            </Route>
          </Route>
          <Route path='/profile'>
            <Route index element={<Profile />} />
            <Route path=':id' element={<Profile />} />
          </Route>
          <Route path='/notifications' element={<Notifications />} />
          <Route path='/messages' element={<Messages />} />
          <Route path='/tickets'>
            <Route index element={<Tickets />} />
            <Route path=':id' element={<Ticket />} />
          </Route>
          <Route path='/chat'>
            <Route
              index
              element={<Chat chatClient={chatClient} user={user} />}
            />
          </Route>
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>
      <ChatwootLiveChat />
    </div>
  )
}

export default App
