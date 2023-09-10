import React from 'react'

import { useSelector } from 'react-redux'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
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
  // Test,
} from './views'

function App() {
  const { isAuth } = useSelector((state) => state.login)

  return (
    <div className='App'>
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
