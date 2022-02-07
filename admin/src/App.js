import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import {useSelector} from 'react-redux'
import { Routes, Route, Navigate} from 'react-router-dom'
import {Header, Footer} from './components'
import {Home, Login, ResetPassword} from './views'


function App() {
 
  const {isAuth} = useSelector(state => state.login)

  return (
    <div className="App">
        <Header/>
          <Routes>
            <Route path='/login' element={!isAuth ? <Login/> : <Navigate to='/dashboard'/>}/>
            <Route path='/dashboard'  element={isAuth ? <Home/> : <Navigate to='/login'/>}/>
            <Route path='/reset' element={<ResetPassword/>}/>
          </Routes>
        <Footer/>
    </div>
  );
}

export default App;
