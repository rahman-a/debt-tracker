import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import {useSelector} from 'react-redux'
import { Routes, Route, Navigate} from 'react-router-dom'
import {Header, Footer} from './components'
import {Dashboard, Login, ResetPassword, Members, Member} from './views'


function App() {
 
  const {isAuth} = useSelector(state => state.login)

  return (
    <div className="App">
        <Header/>
          <Routes>
            <Route path='/login' element={!isAuth ? <Login/> : <Navigate to='/'/>}/>
            <Route path='/' element={isAuth ? <Dashboard/> : <Navigate to='/login'/>}/>
            <Route path='/members' element={isAuth ? <Members/> : <Navigate to='/login'/>}/>
            <Route path='/member/:id' element={isAuth ? <Member/> : <Navigate to='/login'/>}/>
            <Route path='/reset' element={<ResetPassword/>}/>
          </Routes>
        <Footer/>
    </div>
  );
}

export default App;
