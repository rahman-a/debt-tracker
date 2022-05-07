import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.scss'
import { useSelector } from 'react-redux'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Header, Footer } from './components'

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
} from './views'

import Test from './views/test'

function App() {
  const { isAuth } = useSelector((state) => state.login)

  return (
    <div className='App' data-theme='dark'>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route
          path='/login'
          element={!isAuth ? <Login /> : <Navigate to='/' />}
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
          <Route index element={isAuth ? <Chat /> : <Navigate to='/login' />} />
          <Route
            path=':id'
            element={isAuth ? <Chat /> : <Navigate to='/login' />}
          />
        </Route>
        <Route path='/test' element={<Test />} />
        <Route path='/articles/:id' element={<Article />} />
        <Route path='/activate' element={<EmailActivation />} />
        <Route path='/reset' element={<ResetPassword />} />
        <Route path='/terms-conditions' element={<TermsAndConditions />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
