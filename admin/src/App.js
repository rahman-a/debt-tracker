import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.scss'
import { useSelector } from 'react-redux'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Header, Footer } from './components'
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
} from './views'

function App() {
  const { isAuth } = useSelector((state) => state.login)

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
          <Route index element={isAuth ? <Chat /> : <Navigate to='/login' />} />
          <Route
            path=':id'
            element={isAuth ? <Chat /> : <Navigate to='/login' />}
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

        <Route path='/reset' element={<ResetPassword />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
