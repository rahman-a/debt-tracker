import React, {useState} from 'react';
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
  ClosedReports
} from './views'

function App() {
  const [isAuth, setIsAuth] = useState(false)

  return (
    <div className="App">
        <Header isAuth={isAuth} setIsAuth={setIsAuth}/>
          <Routes>
            <Route path='/' element={<Home/>}/> 
            <Route path='/register' element={<Register/>}/>
            <Route path='/login' element={<Login setIsAuth={setIsAuth}/>} />  
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
          </Routes>
        <Footer/>
    </div>
  );
}

export default App;
