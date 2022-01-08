import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import {Header, Footer} from '../src/components'
import Home from './views/Home';

function App() {
  return (
    <div className="App">
      <Header/>
          <Home/>
      <Footer/>
    </div>
  );
}

export default App;
