import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import {useSelector} from 'react-redux'
import { Routes, Route, Navigate} from 'react-router-dom'
import {Header, Footer} from './components'

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
  ResetPassword
} from './views'

function App() {
 
  const {isAuth} = useSelector(state => state.login)

  return (
    <div className="App">
        <Header />
          <Routes>
            <Route path='/' element={<Home/>}/> 
            <Route path='/register' element={<Register/>}/>
            <Route path='/login' element={<Login/>} />  
            <Route path='/operation'>
                <Route index element={isAuth ? <Operation/> : <Navigate to='/login'/>}/>
                <Route path='new' element={isAuth ? <NewOperation/> : <Navigate to='/login'/>}/>
            </Route>
            <Route path='/reports'>
              <Route path='active' element={isAuth ? <ActiveReports/> : <Navigate to='/login'/>}/>
              <Route path='closed' element={isAuth ? <ClosedReports/> : <Navigate to='/login'/>}/>
            </Route>
            <Route path='/profile' element={isAuth ? <Profile/> : <Navigate to='/login'/>}/>
            <Route path='/notifications' element={isAuth ? <Notifications/> : <Navigate to='/login'/>}/>
            <Route path='/messages' element={isAuth ? <Messages/> : <Navigate to='/login'/>}/>
            <Route path='/activate' element={<EmailActivation/>}/>
            <Route path='/reset' element={<ResetPassword/>}/>
          </Routes>
        <Footer/>
    </div>
  );
}

export default App;
