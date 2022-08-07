import React, { useEffect, useCallback } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.scss'
import { useSelector, useDispatch } from 'react-redux'
import { Routes, Route, Navigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import { Header, Footer } from './components'
import chatSound from './audio/chat.mp3'
import {
  Dashboard,
  Login,
  ResetPassword,
  Members,
  Member,
  Operations,
  ActiveReports,
  ClosedReports,
  Notifications,
  Provider,
  Support,
  Ticket,
  Content,
  Articles,
  Article,
  NewArticle,
  Chat,
  // Test,
} from './views'
import actions from './actions'

const socket = io('http://localhost:5000')

function App() {
  const { isAuth, staff } = useSelector((state) => state.login)
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
    if (staff?._id) {
      socket.emit('join', staff._id, (error) => {
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
  }, [staff?._id])

  return (
    <div className='App'>
      <Header />
      <Routes>
        <Route
          path='/login'
          element={!isAuth ? <Login /> : <Navigate to='/' />}
        />
        <Route
          path='/'
          element={isAuth ? <Dashboard /> : <Navigate to='/login' />}
        />
        <Route
          path='/members'
          element={isAuth ? <Members /> : <Navigate to='/login' />}
        />
        <Route
          path='/member/:id'
          element={isAuth ? <Member /> : <Navigate to='/login' />}
        />
        <Route
          path='/operations'
          element={isAuth ? <Operations /> : <Navigate to='/login' />}
        />
        <Route
          path='/reports/active'
          element={isAuth ? <ActiveReports /> : <Navigate to='/login' />}
        />
        <Route
          path='/reports/closed'
          element={isAuth ? <ClosedReports /> : <Navigate to='/login' />}
        />
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
        <Route
          path='/notifications'
          element={isAuth ? <Notifications /> : <Navigate to='/login' />}
        />
        <Route
          path='/provider'
          element={isAuth ? <Provider /> : <Navigate to='/login' />}
        />
        <Route
          path='/support'
          element={isAuth ? <Support /> : <Navigate to='/login' />}
        />
        <Route
          path='/ticket/:id'
          element={isAuth ? <Ticket /> : <Navigate to='/login' />}
        />
        <Route
          path='/content'
          element={isAuth ? <Content /> : <Navigate to='/login' />}
        />
        <Route path='/articles'>
          <Route
            index
            element={isAuth ? <Articles /> : <Navigate to='/login' />}
          />
          <Route
            path='new'
            element={isAuth ? <NewArticle /> : <Navigate to='/login' />}
          />
          <Route
            path=':id'
            element={isAuth ? <Article /> : <Navigate to='/login' />}
          />
        </Route>
        {/* <Route
          path='/test'
          element={isAuth ? <Test /> : <Navigate to='/login' />}
        /> */}
        <Route path='/reset' element={<ResetPassword />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
