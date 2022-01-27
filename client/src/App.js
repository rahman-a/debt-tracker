import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import { Routes, Route} from 'react-router-dom'
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
 
  return (
    <div className="App">
        <Header />
          <Routes>
            <Route path='/' element={<Home/>}/> 
            <Route path='/register' element={<Register/>}/>
            <Route path='/login' element={<Login/>} />  
            <Route path='/operation'>
                <Route index element={<Operation/>}/>
                <Route path='new' element={<NewOperation/>}/>
            </Route>
            <Route path='/reports'>
              <Route path='active' element={<ActiveReports/>}/>
              <Route path='closed' element={<ClosedReports/>}/>
            </Route>
            <Route path='/profile' element={<Profile/>}/>
            <Route path='/notifications' element={<Notifications/>}/>
            <Route path='/messages' element={<Messages/>}/>
            <Route path='/activate' element={<EmailActivation/>}/>
            <Route path='/reset' element={<ResetPassword/>}/>
          </Routes>
        <Footer/>
    </div>
  );
}

export default App;
