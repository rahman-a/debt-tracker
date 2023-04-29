import React, { useEffect, useCallback } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.scss'
import { useSelector, useDispatch } from 'react-redux'
import { Routes, Route, Navigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import { Header } from './components'
import chatSound from './audio/chat.mp3'

import {
  Home,
  Register,
  Login,
  Operation,
  Profile,
  Notifications,
  Messages,
  NewOperation,
  ActiveReports,
  ClosedReports,
  EmailActivation,
  ResetPassword,
  Tickets,
  Ticket,
  Chat,
  Article,
  TermsAndConditions,
  PrivacyPolicy,
} from './views'
import actions from './actions'

const socket =
  import.meta.env.MODE === 'production'
    ? io('https://chat.swtle.com')
    : io('http://localhost:5000')

function App() {
  const { isAuth, user } = useSelector((state) => state.login)
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
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route
          path='/login'
          element={!isAuth ? <Login /> : <Navigate to='/operation' />}
        />
        <Route path='/operation'>
          <Route
            index
            element={isAuth ? <Operation /> : <Navigate to='/login' />}
          />
          <Route
            path='new'
            element={isAuth ? <NewOperation /> : <Navigate to='/login' />}
          />
        </Route>
        <Route path='/reports'>
          <Route
            path='active'
            element={isAuth ? <ActiveReports /> : <Navigate to='/login' />}
          >
            <Route
              path=':id'
              element={isAuth ? <ActiveReports /> : <Navigate to='/login' />}
            />
          </Route>
          <Route
            path='closed'
            element={isAuth ? <ClosedReports /> : <Navigate to='/login' />}
          />
        </Route>
        <Route
          path='/profile'
          element={isAuth ? <Profile /> : <Navigate to='/login' />}
        />
        <Route
          path='/notifications'
          element={isAuth ? <Notifications /> : <Navigate to='/login' />}
        />
        <Route
          path='/messages'
          element={isAuth ? <Messages /> : <Navigate to='/login' />}
        />
        <Route path='/tickets'>
          <Route
            index
            element={isAuth ? <Tickets /> : <Navigate to='/login' />}
          />
          <Route
            path=':id'
            element={isAuth ? <Ticket /> : <Navigate to='/login' />}
          />
        </Route>
        <Route path='/chat'>
          <Route
            index
            element={
              isAuth ? <Chat socket={socket} /> : <Navigate to='/login' />
            }
          />
          <Route
            path=':id'
            element={
              isAuth ? <Chat socket={socket} /> : <Navigate to='/login' />
            }
          />
        </Route>
        <Route path='/articles/:id' element={<Article />} />
        <Route path='/activate' element={<EmailActivation />} />
        <Route path='/reset' element={<ResetPassword />} />
        <Route path='/terms-conditions' element={<TermsAndConditions />} />
        <Route path='/privacy-policy' element={<PrivacyPolicy />} />
      </Routes>
      {/* <Footer /> */}
    </div>
  )
}

export default App
