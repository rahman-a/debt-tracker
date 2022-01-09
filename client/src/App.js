import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import { Routes, Route} from 'react-router-dom'
import {Header, Footer} from './components'
import {
  Home, 
  Register, 
  Login, 
  Operation,
  Reports, 
  Profile, 
  Notifications, 
  Messages
} from './views'

function App() {
  return (
    <div className="App">
        <Header/>
          <Routes>
            <Route path='/' element={<Home/>}/> 
            <Route path='/register' element={<Register/>}/>
            <Route path='/login' element={<Login/>} />  
            <Route path='/operation' element={<Operation/>}/>
            <Route path='/reports' element={<Reports/>}/>
            <Route path='/profile' element={<Profile/>}/>
            <Route path='/notifications' element={<Notifications/>}/>
            <Route path='/messages' element={<Messages/>}/>
          </Routes>
        <Footer/>
    </div>
  );
}

export default App;
