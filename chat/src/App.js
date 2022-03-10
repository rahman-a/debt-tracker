import style from './App.module.scss';
import {Chat, Sidebar} from './components'


function App() {
  return (
    <div className={style.App}>
      <div className={style.App__container}>
        <Sidebar/>
        <Chat/>
      </div>
    </div>
  );
}

export default App;
