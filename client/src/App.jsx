import React, { useEffect, useCallback } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.scss'
import { useSelector, useDispatch } from 'react-redux'
import { Routes, Route, Navigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import { Header, AuthorizationRouter } from './components'
import chatSound from './audio/chat.mp3'
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
} from './views'
import actions from './actions'

const socket =
  import.meta.env.MODE === 'production'
    ? io('https://chat.swtle.com')
    : io('http://localhost:5000')

function App() {
  const { isAuth, user } = useSelector((state) => state.isAuth)
  const dispatch = useDispatch()

  const displayChat = useCallback(
    (data) => {
      const newMessage = {
        conversation: data.conversation,
        createdAt: data.createdAt,
        isRead: false,
        message: data._id,
        body: data.content,
        title: 'New Message',
      }
      dispatch(actions.chat.latestMessages(newMessage))
      const tone = new Audio(chatSound)
      tone.volume = 1
      tone.play()
    },
    [dispatch]
  )

  useEffect(() => {
    if (user?._id) {
      socket.emit('join', user._id, (error) => {
        if (error) alert(error)
      })
    }
    socket.on('message-notification', (data) => {
      displayChat(data)
    })
    return () => {
      if (socket?.connected) {
        socket.off()
      }
    }
  }, [user, socket])

  return (
    <div className='App' data-theme='dark'>
      {isAuth && <Header />}
      <Routes>
        <Route path='/' element={<AuthorizationRouter />}>
          <Route index element={<Operation />} />
          <Route path='/operation'>
            <Route index element={<Operation />} />
            <Route path='new' element={<NewOperation />} />
          </Route>
          <Route path='/reports'>
            <Route path='active' element={<ActiveReports />}>
              <Route path=':id' element={<ActiveReports />} />
            </Route>
            <Route path='closed' element={<ClosedReports />} />
          </Route>
          <Route path='/profile' element={<Profile />} />
          <Route path='/notifications' element={<Notifications />} />
          <Route path='/messages' element={<Messages />} />
          <Route path='/tickets'>
            <Route index element={<Tickets />} />
            <Route path=':id' element={<Ticket />} />
          </Route>
          <Route path='/chat'>
            <Route index element={<Chat socket={socket} />} />
            <Route path=':id' element={<Chat socket={socket} />} />
          </Route>
        </Route>
      </Routes>
      {/* <Footer /> */}
    </div>
  )
}

export default App
